import * as d3 from "d3";
import Delaunator from "delaunator";

// Set up SVG dimensions
const width = 800;
const height = 600;
const svg = d3.select("#triangulation")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px solid #ccc")
    .style("cursor", "pointer");

// Initialize points array
let points = [];

// Function to render the triangulation
function renderTriangulation() {
    // Clear previous visualization
    svg.selectAll("*").remove();

    if (points.length < 3) return; // Need at least 3 points for triangulation

    // Generate Delaunay triangulation
    const delaunay = Delaunator.from(points);
    const triangles = delaunay.triangles;

    // Draw triangles
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

// Add a click event listener to the SVG
svg.on("click", function (event) {
    const [x, y] = d3.pointer(event);
    points.push([x, y]); // Add the new point
    renderTriangulation(); // Re-render the visualization
});

// Initial rendering (empty triangulation)
renderTriangulation();

// Create the cursor ball element
const cursorBall = document.createElement("div");
cursorBall.id = "cursor-ball";
cursorBall.style.display = "none"; // Initially hidden
document.body.appendChild(cursorBall);

// Update the ball's position on mousemove
svg.on("mousemove", function (event) {
    const [x, y] = d3.pointer(event);
    cursorBall.style.left = `${x + svg.node().getBoundingClientRect().left}px`;
    cursorBall.style.top = `${y + svg.node().getBoundingClientRect().top}px`;
});

// Show the ball cursor when entering the SVG
svg.on("mouseenter", function () {
    cursorBall.style.display = "block"; // Show the cursor
});

// Hide the ball cursor when leaving the SVG
svg.on("mouseleave", function () {
    cursorBall.style.display = "none"; // Hide the cursor
});

