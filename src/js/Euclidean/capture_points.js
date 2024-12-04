import * as d3 from "d3";
import { transform } from "./transforms.js"
import { triangulate, render} from "./triangulation.js"

export function capture_points(svgElement) {
    var originalCenter = { x: 0, y: 0 }; // Starting center is (0, 0)
    const stepSize = 5; // Movement step size

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
        originalCenter.x -= dx
        originalCenter.y += dy
        transform(svgElement, dx, -dy);
    });

    // Collect points and adjust based on transform
    let euclideanPoints = [];

    svgElement.on('click', function (event) {
        const [clickX, clickY] = d3.pointer(event, this); // Get clicked point
        const adjustedX = originalCenter.x + clickX; // Adjust by translation
        const adjustedY = originalCenter.y + clickY; // Adjust by translation


        euclideanPoints.push([adjustedX, adjustedY]);
        let {points, triangles} = triangulate(euclideanPoints); // Update Euclidean triangulation
        render(svgElement, points, triangles, [originalCenter.x, originalCenter.y]);
    });
}
