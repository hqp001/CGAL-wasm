import * as d3 from "d3";
import { transform } from "./transforms.js"
import { triangulate} from "./triangulation.js"

export function capture_points(svgElement) {
    const stepSize = 5; // Movement step size

    let poincarePoints = [];
    // Listen for key presses to move objects
    document.addEventListener('keydown', (event) => {
        let dx = 0; // Cumulative translation in x
        let dy = 0; // Cumulative translation in y

        switch (event.key) {
            case 'w': // Move up
                dy += stepSize;
                break;
            case 'a': // Move left
                dx -= stepSize;
                break;
            case 's': // Move down
                dy -= stepSize;
                break;
            case 'd': // Move right
                dx += stepSize;
                break;
            default:
                return; // Ignore other keys
        }

        // Call the external transform function
        console.log("P", poincarePoints);
        poincarePoints = transform(svgElement, dx, -dy, poincarePoints);
        console.log("G", poincarePoints);
    });

    // Collect points and adjust based on transform

    svgElement.on('click', function (event) {
        const [clickX, clickY] = d3.pointer(event, this); // Get clicked point

        const circle = svgElement.select("#poincare-circle");
        const cx = +circle.attr("cx"); // Circle center x-coordinate
        const cy = +circle.attr("cy"); // Circle center y-coordinate
        const radius = +circle.attr("r"); // Circle radius

        // Check if the point is inside the Poincaré disk
        const dx = (clickX - cx) / radius;
        const dy = (clickY - cy) / radius;

        if (dx * dx + dy * dy <= 1) {
            poincarePoints.push([dx, dy]); // Add valid points only
            triangulate(svgElement, poincarePoints); // Update Euclidean triangulation
        }

    });
}

/*
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

*/
