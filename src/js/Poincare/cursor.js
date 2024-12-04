import * as d3 from "d3"

/*
export function initBallCursor(svg) {
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
}

*/

export function initBallCursor(svg) {
    /**
     * @param {Object} svg - The D3.js selection of the SVG element.
     * @param {number} radius - The hyperbolic radius for point size calculation.
     * @param {number} scale - The scaling factor for the Poincaré disk rendering.
     */

    // Create the cursor ball element
    const cursorBall = document.createElement("div");
    cursorBall.id = "cursor-ball";
    cursorBall.style.display = "none"; // Initially hidden
    document.body.appendChild(cursorBall);

    // Helper functions for hyperbolic geometry
    function magnitudeSquared(v) {
        return v[0] * v[0] + v[1] * v[1];
    }

    function magnitude(v) {
        return Math.sqrt(magnitudeSquared(v));
    }

    function polarToCartesian(mag, angle) {
        return [mag * Math.cos(angle), mag * Math.sin(angle)];
    }

    // Update the ball's position and size on mousemove
    let radius = 0.03 * 1.4;
    svg.on("mousemove", function (event) {
        const [x, y] = d3.pointer(event);

        // Calculate the relative position in the Poincaré disk
        const circle = svg.select("#poincare-circle");
        const cx = +circle.attr("cx"); // Circle center x-coordinate
        const cy = +circle.attr("cy"); // Circle center y-coordinate
        const svgr = +circle.attr("r"); // Circle radius
        const point = [(x - cx) / svgr, (y - cy) / svgr];

        const a = magnitude(point); // Hyperbolic distance from the origin

        // Perform hyperbolic transformations
        const pmag = ((1 + a) * Math.exp(radius) - (1 - a)) / ((1 + a) * Math.exp(radius) + (1 - a));
        const qmag = ((1 + a) - (1 - a) * Math.exp(radius)) / ((1 + a) + (1 - a) * Math.exp(radius));

        // Calculate the radius for rendering
        const p = polarToCartesian(pmag, Math.atan2(point[1], point[0]));
        const q = polarToCartesian(qmag, Math.atan2(point[1], point[0]));
        const l = 0.5 * Math.sqrt(magnitudeSquared([p[0] - q[0], p[1] - q[1]]));
        const renderedRadius = svgr * 4 * l;

        // Update cursor position and size
        cursorBall.style.left = `${x + svg.node().getBoundingClientRect().left}px`;
        cursorBall.style.top = `${y + svg.node().getBoundingClientRect().top}px`;
        if (point[0] ** 2 + point[1] ** 2 < 1) {
            cursorBall.style.width = `${renderedRadius}px`;
            cursorBall.style.height = `${renderedRadius}px`;
        }
        else {
            cursorBall.style.width = `${12}px`;
            cursorBall.style.height = `${12}px`;
        }
    });

    // Show the ball cursor when entering the SVG
    svg.on("mouseenter", function () {
        cursorBall.style.display = "block"; // Show the cursor
    });

    // Hide the ball cursor when leaving the SVG
    svg.on("mouseleave", function () {
        cursorBall.style.display = "none"; // Hide the cursor
    });
}

