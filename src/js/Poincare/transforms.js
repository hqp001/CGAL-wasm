/*
export function transform(svgElement, dx, dy) {
    svgElement.selectAll('circle, polygon').attr(
        'transform',
        `translate(${dx}, ${dy})`
    );
}
*/

import * as d3 from "d3";
import {calculateRadius} from "./triangulation.js"
import {drawLine} from "./circum.js"

export function transform(svg, dx, dy, poincarePoints) {
    /**
     * @param {Object} svg - The D3.js selection of the SVG element.
     * @param {number} dx - The x-direction of the movement in the disk.
     * @param {number} dy - The y-direction of the movement in the disk.
     */

    // Helper functions for Poincaré transformations
    //
    function sub(a, b) {
        return [a[0] - b[0], a[1] - b[1]];
    }

    function mul(a, b) {
        return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
    }

    function con(a) {
        return [a[0], -a[1]];
    }

    function mog(a) {
        return a[0] * a[0] + a[1] * a[1];
    }

    function div(a, b) {
        let ans = mul(a, con(b));
        return [ans[0] / mog(b), ans[1] / mog(b)];
    }

    function shift(z, k) {
        let num = sub(z, k);
        let den;
        if (mog(num) == 0) {
            den = [1, 0];
        } else {
            den = sub([1, 0], div(mul([mog(k), 0], z), k));
        }
        let ans = div(num, den);
        return ans;
    }


    // Get Poincaré circle info
    const circle = svg.select("#poincare-circle");
    const cx = +circle.attr("cx"); // Circle center x-coordinate
    const cy = +circle.attr("cy"); // Circle center y-coordinate
    const radius = +circle.attr("r"); // Circle radius

    poincarePoints = poincarePoints.map(point => shift(point, mul([dx, dy], [0.01 * -1, 0])));

    // Process points
    svg.selectAll(".points")
        .each(function () {
            const point = d3.select(this);

            // Get current point position
            const x = +point.attr("cx");
            const y = +point.attr("cy");

            // Normalize to Poincaré disk
            const normalizedPoint = [(x - cx) / radius, (y - cy) / radius];

            // Apply transformation
            const transformed = shift(normalizedPoint, mul([dx, dy], [0.01 * -1, 0]));

            let renderRadius = calculateRadius(transformed) * radius;


            // Transform back to screen space
            const newX = transformed[0] * radius + cx;
            const newY = transformed[1] * radius + cy;

            // Update point position
            point.attr("cx", newX).attr("cy", newY).attr("r", renderRadius);
        });

    svg.selectAll(".lines")
        .each(function () {
            const line = d3.select(this);

            // Get custom data attributes
            const dataPointOne = +line.attr("data-point-one"); // Assuming JSON string
            const dataPointTwo = +line.attr("data-point-two"); // Assuming JSON string

            let l = drawLine(poincarePoints[dataPointOne], poincarePoints[dataPointTwo]);


            const arc = d3.path();
            let s = poincarePoints[dataPointOne];
            let e = poincarePoints[dataPointTwo];

            let startAngle = Math.atan2(s[1] - l[0][1],  s[0] - l[0][0]) + 0 * (Math.PI / 2);
            let endAngle = Math.atan2(e[1] - l[0][1], e[0] - l[0][0]) + 0 * (Math.PI / 2);

            if (startAngle > endAngle) {
                [startAngle, endAngle] = [endAngle, startAngle];
            }
            let clockwise = 1;
            if (endAngle - startAngle > Math.PI) {
                clockwise = 0;
            }

            arc.arc(l[0][0] *radius + cx, l[0][1] * radius + cy, l[1] * radius, startAngle, endAngle, 1 -clockwise);

            line.attr("d", arc.toString());

            // Leave other transformations for later
        });



    return poincarePoints;

}

