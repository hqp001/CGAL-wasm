/*
export function transform(svgElement, dx, dy) {
    svgElement.selectAll('circle, polygon').attr(
        'transform',
        `translate(${dx}, ${dy})`
    );
}
*/

import * as d3 from "d3";

export function transform(svgElement, dx, dy) {
    // Update circle positions
    svgElement.selectAll('circle')
        .each(function () {
            const circle = d3.select(this);
            const currentX = parseFloat(circle.attr('cx'));
            const currentY = parseFloat(circle.attr('cy'));
            circle.attr('cx', currentX + dx).attr('cy', currentY + dy);
        });

    // Update polygon points
    svgElement.selectAll('polygon')
        .each(function () {
            const polygon = d3.select(this);
            const points = polygon.attr('points')
                .split(' ')
                .map(point => point.split(',').map(Number)); // Parse points into numbers

            const updatedPoints = points.map(([x, y]) => [x + dx, y + dy]); // Adjust each point

            const updatedPointsStr = updatedPoints
                .map(([x, y]) => `${x},${y}`)
                .join(' '); // Convert back to string format
            polygon.attr('points', updatedPointsStr);
        });
}

