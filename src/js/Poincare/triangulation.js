import * as d3 from "d3";
import Module from '../../cpp/f.js';

function compress(svgx, svgy, svgradius, x, y) {
    return [(x - svgx) / svgradius, (y - svgy) / svgradius];
}

function decompress([cx, cy, radius], [x, y]) {
    return [x * radius + cx, y * radius + cy];
}

function drawArcFromPoints(svg, center_x, center_y, r, start_X, start_Y, end_X, end_Y, i, j) {
    // Decompress the normalized inputs to real-world coordinates
    // Update radius to scaled size
    let startAngle = Math.atan2(start_Y - center_y, start_X - center_x) + 0 * (Math.PI / 2);
    let endAngle = Math.atan2(end_Y - center_y, end_X - center_x) + 0 * (Math.PI / 2);

    if (startAngle > endAngle) {
        [startAngle, endAngle] = [endAngle, startAngle];
    }
    let clockwise = 1;
    if (endAngle - startAngle > Math.PI) {
        clockwise = 0;
    }


    const arc = d3.path();
    arc.arc(center_x,center_y,r,endAngle, startAngle, clockwise)

    svg.append("path")
        .attr("d", arc.toString())
        .attr("class", "lines")
        .attr("fill", "none")
        .attr("stroke", "black") // Stroke color
        .attr("data-center-x", center_x) // Custom attribute
        .attr("data-center-y", center_y)
        .attr("data-point-one", i) // Custom attribute
        .attr("data-point-two", j); // Custom attribute

    /*
    svg.append("circle")
        .attr("class", "points")
        .attr("cx", center_x)
        .attr("cy", center_y)
        .attr("r", 5)
        //.attr("fill", "none")
        .attr("stroke", "green");
    */

    /*
    svg.append("circle")
        .attr("class", "points hidden")
        .attr("cx", center_x)
        .attr("cy", center_y)
        .attr("r", 5)
        .attr("stroke", "green")
        .attr("visibility", "hidden"); // Makes the circle hidden
    */




}

function render(svg, points, triangles) {
    // Clear previous visualization
    svg.selectAll("*")
        .filter(function () {
            // Preserve the Poincaré circle by its unique ID
            return !this.matches("#poincare-circle");
    })
    .remove();

    const circle = svg.select("#poincare-circle");
    const cx = +circle.attr("cx"); // Circle center x-coordinate
    const cy = +circle.attr("cy"); // Circle center y-coordinate
    const radius = +circle.attr("r"); // Circle radius

    const depoints = points.map(points => decompress([cx, cy, radius], points));

    triangles.forEach(([i1, i2, i3, i4, i5, i6]) => {
        const [p1, p2] = [
            depoints[i1],
            depoints[i2],
        ];

        let [center_x, center_y] = decompress([cx, cy, radius], [i4, i5]);
        let r = Math.sqrt(i6) * radius;
        drawArcFromPoints(svg, center_x, center_y, r, p1[0], p1[1], p2[0], p2[1], i1, i2);

    });

    /*
    svg.selectAll(".points")
        .data(depoints)
        .enter()
        .append("circle")
        .attr("class", "points")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", 5)
        .attr("fill", "red");
    */

    renderPoints(svg, points, [cx, cy, radius]);


}



export async function triangulate(svg, points) {


    if (points.length < 3) {
        render(svg, points, []);
    }

    // Run Delaunay triangulation on filtered points

    const instance = await Module();

    // Run Delaunay triangulation on filtered points
    const convertedArray = points.map(([x, y]) => ({ x, y }));
    const delaunayFaces = instance.processArray(convertedArray);

    render(svg, points, delaunayFaces);


}

export function calculateRadius(point) {
    function magnitudeSquared(v) {
        return v[0] * v[0] + v[1] * v[1];
    }

    function magnitude(v) {
        return Math.sqrt(magnitudeSquared(v));
    }

    function polarToCartesian(mag, angle) {
        return [mag * Math.cos(angle), mag * Math.sin(angle)];
    }

    const radius = 0.03 * 1.4; // Example hyperbolic radius based on stroke width

    const a = magnitude(point); // Hyperbolic distance from the origin
    const angle = Math.atan2(point[1], point[0]); // Angle in polar coordinates

    // Step 2: Compute the hyperbolic transformations
    const pmag = ((1 + a) * Math.exp(radius) - (1 - a)) / ((1 + a) * Math.exp(radius) + (1 - a));
    const qmag = ((1 + a) - (1 - a) * Math.exp(radius)) / ((1 + a) + (1 - a) * Math.exp(radius));

    // Step 3: Convert polar coordinates to Cartesian
    const p = polarToCartesian(pmag, angle);
    const q = polarToCartesian(qmag, angle);

    // Step 4: Calculate the radius for rendering
    const l = 0.5 * Math.sqrt(magnitudeSquared([p[0] - q[0], p[1] - q[1]]));
    const renderedRadius = 2 * l;

    return renderedRadius;
}

function renderPoints(svg, points, [cx, cy, r]) {
  /**
   * @param {Object} svg - The D3.js selection of the SVG element.
   * @param {Array} points - A list of points in the Poincaré disk, each as [x, y].
   */

  // Constants for rendering
  const scale = r ; // Example scaling factor for rendering

  // Helper functions for hyperbolic geometry

  points.forEach(point => {
    // Step 1: Compute the magnitude and angle of the point in the Poincaré disk
      //
    let renderedRadius = calculateRadius(point) * scale;

    // Step 5: Render the point on the SVG using D3
    svg.append("circle")
      .attr("cx", point[0] * r + cx) // Translate x to the center of the canvas
      .attr("cy", point[1] * r + cy) // Translate y to the center of the canvas (inverted)
      .attr("r", renderedRadius)
      .attr("class", "points")
      .attr("fill", "red") // You can change this to a dynamic color
      .attr("opacity", 1); // You can adjust opacity as needed
  });
}

