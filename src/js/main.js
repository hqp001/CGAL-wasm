import { initBallCursor } from "./cursor.js";
import { renderTriangulation } from "./triangulation.js";
import { renderPoincare } from "./poincare.js";
import * as d3 from "d3";


// Dynamically set width and height based on screen size
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// Set width and height for Euclidean SVG
const euclideanWidth = screenWidth * 0.50; // Use 45% of the screen width
const euclideanHeight = screenHeight * 0.50; // Use 90% of the screen height

const euclideanSvg = d3.select("#euclidean-triangulation")
    .attr("width", euclideanWidth)
    .attr("height", euclideanHeight)
    .style("border", "1px solid #ccc")
    .style("cursor", "none");

// Set width and height for Poincaré Model SVG
const poincareSvg = d3.select("#poincare-model")
    .attr("width", euclideanWidth)
    .attr("height", euclideanHeight)
    .style("border", "1px solid #ccc")
    .style("cursor", "none");



let euclideanPoints = [];
let poincarePoints = [];

// Add a ball cursor to both SVGs
initBallCursor(euclideanSvg);
initBallCursor(poincareSvg);

// Handle clicks for Euclidean triangulation
euclideanSvg.on("click", function (event) {
    const [x, y] = d3.pointer(event);
    euclideanPoints.push([x, y]);
    renderTriangulation(euclideanSvg, euclideanPoints); // Update Euclidean triangulation
});

// Handle clicks for Poincaré model
poincareSvg.on("click", function (event) {
    const [x, y] = d3.pointer(event);
    const radius = Math.min(poincareSvg.attr("width"), poincareSvg.attr("height")) / 2;

    // Check if the point is inside the Poincaré disk
    const dx = x - radius;
    const dy = y - radius;
    if (dx * dx + dy * dy <= (radius - 2) ** 2) {
        poincarePoints.push([x, y]); // Add valid points only
        renderPoincare(poincareSvg, poincarePoints); // Update Poincaré model
    }
});


// Initial rendering for both
renderTriangulation(euclideanSvg, euclideanPoints);
renderPoincare(poincareSvg, poincarePoints);

