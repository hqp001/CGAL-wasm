import * as d3 from "d3";
import Delaunator from "delaunator";

export function triangulate(points) {
    if (points.length < 3) return { points, triangles: [] }; // Properly assign an empty array to 'triangles'

    // Generate Delaunay triangulation
    const delaunay = Delaunator.from(points);
    const triangles = delaunay.triangles;

    return { points, triangles }

}

export function render(svg, points, triangles, center) {
    // Clear previous visualization
    svg.selectAll("*").remove();

    // Adjust points based on the new center
    const adjustedPoints = points.map(([x, y]) => [x - center[0], (y - center[1])]);

    // Render circles for points
    svg.selectAll("circle")
        .data(adjustedPoints)
        .enter()
        .append("circle")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", 5)
        .attr("fill", "red");

    // Draw triangles without fill color
    for (let i = 0; i < triangles.length; i += 3) {
        const [p1, p2, p3] = [
            adjustedPoints[triangles[i]],
            adjustedPoints[triangles[i + 1]],
            adjustedPoints[triangles[i + 2]]
        ];

        svg.append("polygon")
            .attr(
                "points",
                `${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`
            )
            .attr("fill", "none") // No fill color
            .attr("stroke", "#333") // Stroke color
            .attr("stroke-width", 1);
    }
}

