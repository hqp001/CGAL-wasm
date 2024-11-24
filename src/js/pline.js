// pline.js

/**
 * Draws a hyperbolic geodesic in the Poincaré disk model.
 * @param {Object} svg - The SVG element where the geodesic will be drawn.
 * @param {Object} p0 - The first point in normalized coordinates {x, y}.
 * @param {Object} p1 - The second point in normalized coordinates {x, y}.
 */
export function drawHyperbolicGeodesic(svg, radius, centerX, centerY, p0, p1) {

  // Convert normalized coordinates [-1, 1] to SVG coordinates
  const svgP0 = { x: centerX + p0.x * radius, y: centerY + p0.y * radius };
  const svgP1 = { x: centerX + p1.x * radius, y: centerY + p1.y * radius };

    console.log(svgP0, svgP1);

  // Check if points are diametrically opposite
  const isDiameter = Math.abs(p0.x * p1.y - p0.y * p1.x) < 1e-6;

  let path;
  if (isDiameter) {
    // Straight line for diametrically opposite points
    path = `M ${svgP0.x} ${svgP0.y} L ${svgP1.x} ${svgP1.y}`;
  } else {
    // Calculate the orthogonal circle center and radius
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const d = Math.hypot(dx, dy);

    const mx = (p0.x + p1.x) / 2;
    const my = (p0.y + p1.y) / 2;

    const center = {
      x: mx + (dy * Math.sqrt(1 - (d / 2) ** 2)) / d,
      y: my - (dx * Math.sqrt(1 - (d / 2) ** 2)) / d,
    };

    const orthogonalRadius = Math.hypot(center.x - p0.x, center.y - p0.y);
    const angle0 = Math.atan2(p0.y - center.y, p0.x - center.x);
    const angle1 = Math.atan2(p1.y - center.y, p1.x - center.x);

    const largeArcFlag = Math.abs(angle1 - angle0) > Math.PI ? 1 : 0;

    // Convert to SVG coordinates
    const svgCenter = {
      x: center.x * radius + centerX,
      y: centerY + center.y * radius,
    };

    path = `
      M ${svgP0.x} ${svgP0.y}
      A ${orthogonalRadius * radius} ${orthogonalRadius * radius} 0 ${largeArcFlag} 1 ${svgP1.x} ${svgP1.y}`;
  }

  // Render path in the SVG
    console.log(path);
  svg.append("path")
    .attr("d", path)
    .attr("stroke", "blue")
    .attr("fill", "none");
}

