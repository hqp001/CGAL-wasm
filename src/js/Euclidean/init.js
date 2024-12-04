import * as d3 from "d3";
import { initBallCursor } from "../cursor.js"
import { capture_points } from "./capture_points.js"

export function init() {

    const euclideanSvg = d3.select("#euclidean-triangulation")
        .style("border", "1px solid #ccc")
        .style("cursor", "none");

    initBallCursor(euclideanSvg);
    capture_points(euclideanSvg);
    return euclideanSvg

}

