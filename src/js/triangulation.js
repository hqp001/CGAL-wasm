import * as d3 from "d3";
import Delaunator from "delaunator";

export function renderTriangulation(svg, points) {
    // Clear previous visualization
    svg.selectAll("*").remove();

    svg.selectAll("circle")
        .data(points)
        .enter()
        .append("circle")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", 5)
        .attr("fill", "red");

    if (points.length < 3) return; // Need at least 3 points for triangulation

    // Generate Delaunay triangulation
    const delaunay = Delaunator.from(points);
    const triangles = delaunay.triangles;

    // Draw triangles without fill color
    for (let i = 0; i < triangles.length; i += 3) {
        const [p1, p2, p3] = [
            points[triangles[i]],
            points[triangles[i + 1]],
            points[triangles[i + 2]]
        ];

        svg.append("polygon")
            .attr("points", `${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`)
            .attr("fill", "none") // No fill color
            .attr("stroke", "#333") // Stroke color
            .attr("stroke-width", 1);
    }

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

