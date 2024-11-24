import * as d3 from "d3";
import Module from '../cpp/f.js';
import * as pline from "./pline.js";

function compress(svgx, svgy, svgradius, x, y) {
    return [(x - svgx) / svgradius, (y - svgy) / svgradius];
}

function decompress(svgx, svgy, svgradius, x, y) {
    return [x * svgradius + svgx, y * svgradius + svgy];
}

function drawArcFromPoints(svg, svgx, svgy, svg_radius, center_x, center_y, r, start_X, start_Y, end_X, end_Y) {
    // Decompress the normalized inputs to real-world coordinates
    const startAngle = Math.atan2(start_Y - center_y, start_X - center_x);
    const endAngle = Math.atan2(end_Y - center_y, end_X - center_x);

    [start_X, start_Y] = decompress(svgx, svgy, svg_radius, start_X, start_Y);
    [end_X, end_Y] = decompress(svgx, svgy, svg_radius, end_X, end_Y);
    [center_x, center_y] = decompress(svgx, svgy, svg_radius, center_x, center_y);

    // Update radius to scaled size
    r = Math.sqrt(r) * svg_radius;

    const largeArcFlag = 0;
    const path = `
        M ${start_X} ${start_Y}
        A ${r} ${r} 0 ${largeArcFlag} 1 ${end_X} ${end_Y}
    `;

    // Append the arc to the SVG
    svg.append("path")
        .attr("d", path)
        .attr("fill", "none") // Optional: Customize fill color
        .attr("stroke", "black"); // Optional: Customize stroke color

}


export async function renderPoincare(svg, points) {
    // Clear previous visualization
    svg.selectAll("*")
        .filter(function () {
            // Preserve the Poincaré circle by its unique ID
            return !this.matches("#poincare-circle");
    })
    .remove();

    console.log(points);
    svg.selectAll("circle")
        .data(points)
        .enter()
        .append("circle")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", 5)
        .attr("fill", "red");


    if (points.length < 3) return;

    // Run Delaunay triangulation on filtered points
    const circle = svg.select("#poincare-circle");
    const cx = +circle.attr("cx"); // Circle center x-coordinate
    const cy = +circle.attr("cy"); // Circle center y-coordinate
    const radius = +circle.attr("r"); // Circle radius


    const inputArray = points.map(([x, y]) => ({
        x: (x - cx) / radius,
        y: (y - cy) / radius}));


    const instance = await Module();

    // Run Delaunay triangulation on filtered points
    const delaunayFaces = instance.processArray(inputArray);

    // Render the triangles
    delaunayFaces.forEach(([i1, i2, i3, i4, i5, i6]) => {
        const [p1, p2] = [
            inputArray[i1],
            inputArray[i2],
        ];
        //pline.drawHyperbolicGeodesic(svg, radius, cx, cy, p1, p2);

        drawArcFromPoints(svg, cx, cy, radius, i4, i5, i6, p1.x, p1.y, p2.x, p2.y);

    });


    console.log("Filtered points and triangulation rendered.");
    // Draw points
    svg.selectAll("circle")
        .data(points)
        .enter()
        .append("circle")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", 5)
        .attr("fill", "red");
}

