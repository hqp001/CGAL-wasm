import { initBallCursor } from "./cursor.js";
import { renderTriangulation } from "./triangulation.js";
import { renderPoincare } from "./poincare.js";
import * as d3 from "d3";


// Dynamically set width and height based on screen size

const euclideanSvg = d3.select("#euclidean-triangulation")
    .style("border", "1px solid #ccc")
    .style("cursor", "none");

let euclideanPoints = [];
initBallCursor(euclideanSvg);
renderTriangulation(euclideanSvg, euclideanPoints);


const poincareSvg = d3.select("#poincare-model")
    .style("border", "1px solid #ccc")
    .style("cursor", "none");

// Function to draw or update the circle
function drawCircle() {
    // Get SVG dimensions dynamically
    const width = poincareSvg.node().clientWidth;
    const height = poincareSvg.node().clientHeight;

    // Calculate center coordinates
    const cx = width / 2;
    const cy = height / 2;

    // Calculate radius (optional: fit within the smallest dimension)
    const radius = Math.min(width, height) / (2*1.2); // Subtract padding for better visibility

    // Remove the old circle (if it exists)
    poincareSvg.selectAll("circle").remove();

    // Append a circle to the SVG
    poincareSvg.append("circle")
        .attr("id", "poincare-circle")
        .attr("cx", cx) // Center x-coordinate
        .attr("cy", cy) // Center y-coordinate
        .attr("r", radius) // Circle radius
        .attr("fill", "none") // Optional: Transparent fill
        .attr("stroke", "black"); // Optional: Black stroke
}

// Initial draw
drawCircle();

// Redraw on window resize
window.addEventListener("resize", drawCircle);

let poincarePoints = [];

initBallCursor(poincareSvg);
//renderPoincare(poincareSvg, poincarePoints);

// Handle clicks for Euclidean triangulation
euclideanSvg.on("click", function (event) {
    const [x, y] = d3.pointer(event);
    euclideanPoints.push([x, y]);
    renderTriangulation(euclideanSvg, euclideanPoints); // Update Euclidean triangulation
});

// Handle clicks for Poincaré model
poincareSvg.on("click", function (event) {
    const [x, y] = d3.pointer(event);
    const circle = poincareSvg.select("#poincare-circle");
    const cx = +circle.attr("cx"); // Circle center x-coordinate
    const cy = +circle.attr("cy"); // Circle center y-coordinate
    const radius = +circle.attr("r"); // Circle radius

    // Check if the point is inside the Poincaré disk
    const dx = x - cx;
    const dy = y - cy;
    if (dx * dx + dy * dy <= radius ** 2) {
        poincarePoints.push([x, y]); // Add valid points only
        renderPoincare(poincareSvg, poincarePoints); // Update Poincaré model
    }
});


// Initial rendering for both

