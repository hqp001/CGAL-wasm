import * as d3 from "d3";
import { initBallCursor } from "./cursor.js"
import { capture_points } from "./capture_points.js"

// Function to draw or update the circle
function drawCircle(poincareSvg) {
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


export function init() {


    const poincareSvg = d3.select("#poincare-model")
        .style("border", "1px solid #ccc")
        .style("cursor", "none");

    drawCircle(poincareSvg);

    // Redraw on window resize
    window.addEventListener("resize", drawCircle(poincareSvg));

    let poincarePoints = [];

    initBallCursor(poincareSvg);

    capture_points(poincareSvg);

    return poincareSvg

}

