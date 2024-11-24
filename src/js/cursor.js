import * as d3 from "d3"

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

