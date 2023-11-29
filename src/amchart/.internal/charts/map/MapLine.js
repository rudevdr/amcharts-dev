import * as $type from "../../core/util/Type";
import { Percent } from "../../core/util/Percent";
import { Graphics } from "../../core/render/Graphics";
import { geoLength, geoInterpolate, geoDistance } from "d3-geo";
/**
 * A line object in a [[MapLineSeries]].
 */
export class MapLine extends Graphics {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_projectionDirty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    _beforeChanged() {
        super._beforeChanged();
        if (this._projectionDirty || this.isDirty("geometry") || this.isDirty("precision")) {
            const geometry = this.get("geometry");
            if (geometry) {
                const series = this.getPrivate("series");
                if (series) {
                    const chart = series.chart;
                    if (chart) {
                        const projection = chart.get("projection");
                        let clipAngle = null;
                        if (projection && projection.clipAngle) {
                            clipAngle = projection.clipAngle();
                            projection.precision(this.get("precision", 0.5));
                        }
                        const dataItem = this.dataItem;
                        const geoPath = chart.getPrivate("geoPath");
                        if (geoPath && dataItem) {
                            this._clear = true;
                            if (dataItem.get("lineType", series.get("lineType")) == "straight") {
                                const geometry = this.get("geometry");
                                if (geometry) {
                                    let coordinates = geometry.coordinates;
                                    if (coordinates) {
                                        let segments;
                                        if (geometry.type == "LineString") {
                                            segments = [coordinates];
                                        }
                                        else if (geometry.type == "MultiLineString") {
                                            segments = coordinates;
                                        }
                                        this.set("draw", (display) => {
                                            for (let s = 0; s < segments.length; s++) {
                                                let segment = segments[s];
                                                if (segment.length > 0) {
                                                    const gp0 = segment[0];
                                                    const p0 = chart.convert({ longitude: gp0[0], latitude: gp0[1] });
                                                    display.lineTo(p0.x, p0.y);
                                                    for (let p = 0; p < segment.length; p++) {
                                                        const gp = segment[p];
                                                        const pn = chart.convert({ longitude: gp[0], latitude: gp[1] });
                                                        display.lineTo(pn.x, pn.y);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                            else {
                                this.set("draw", (_display) => {
                                    if (projection && series.get("clipBack") === false) {
                                        projection.clipAngle(180);
                                    }
                                    geoPath.context(this._display);
                                    geoPath(geometry);
                                    geoPath.context(null);
                                    if (projection && projection.clipAngle) {
                                        projection.clipAngle(clipAngle);
                                    }
                                });
                            }
                        }
                    }
                }
            }
            const type = "linechanged";
            if (this.events.isEnabled(type)) {
                this.events.dispatch(type, { type: type, target: this });
            }
        }
    }
    /**
     * @ignore
     */
    markDirtyProjection() {
        this.markDirty();
        this._projectionDirty = true;
    }
    _clearDirty() {
        super._clearDirty();
        this._projectionDirty = false;
    }
    _getTooltipPoint() {
        let tooltipX = this.get("tooltipX");
        let tooltipY = this.get("tooltipY");
        let x = 0;
        let y = 0;
        if ($type.isNumber(tooltipX)) {
            x = tooltipX;
        }
        if ($type.isNumber(tooltipY)) {
            y = tooltipY;
        }
        if (tooltipX instanceof Percent) {
            const geoPoint = this.positionToGeoPoint(tooltipX.value);
            const series = this.getPrivate("series");
            if (series) {
                const chart = series.chart;
                if (chart) {
                    const point = chart.convert(geoPoint);
                    x = point.x;
                    y = point.y;
                }
            }
        }
        return { x, y };
    }
    /**
     * Converts relative position along the line (0-1) into pixel coordinates.
     *
     * @param position  Position (0-1)
     * @return Coordinates
     */
    positionToGeoPoint(position) {
        const geometry = this.get("geometry");
        const series = this.getPrivate("series");
        const chart = series.chart;
        const dataItem = this.dataItem;
        if (geometry && series && chart && dataItem) {
            const lineType = dataItem.get("lineType", series.get("lineType"));
            let totalDistance = geoLength(geometry);
            let currentDistance = 0;
            let distanceAB;
            let positionA = 0;
            let positionB = 0;
            let pointA;
            let pointB;
            let coordinates = geometry.coordinates;
            if (coordinates) {
                let segments;
                if (geometry.type == "LineString") {
                    segments = [coordinates];
                }
                else if (geometry.type == "MultiLineString") {
                    segments = coordinates;
                }
                for (let s = 0; s < segments.length; s++) {
                    let segment = segments[s];
                    if (segment.length > 1) {
                        for (let p = 1; p < segment.length; p++) {
                            pointA = segment[p - 1];
                            pointB = segment[p];
                            positionA = currentDistance / totalDistance;
                            distanceAB = geoDistance(pointA, pointB);
                            currentDistance += distanceAB;
                            positionB = currentDistance / totalDistance;
                            if (positionA <= position && positionB > position) {
                                s = segments.length;
                                break;
                            }
                        }
                    }
                    else if (segment.length == 1) {
                        pointA = segment[0];
                        pointB = segment[0];
                        positionA = 0;
                        positionB = 1;
                    }
                }
                if (pointA && pointB) {
                    let positionAB = (position - positionA) / (positionB - positionA);
                    let location;
                    if (lineType == "straight") {
                        let p0 = chart.convert({ longitude: pointA[0], latitude: pointA[1] });
                        let p1 = chart.convert({ longitude: pointB[0], latitude: pointB[1] });
                        let x = p0.x + (p1.x - p0.x) * positionAB;
                        let y = p0.y + (p1.y - p0.y) * positionAB;
                        return chart.invert({ x: x, y: y });
                    }
                    else {
                        location = geoInterpolate(pointA, pointB)(positionAB);
                        return { longitude: location[0], latitude: location[1] };
                    }
                }
            }
        }
        return { longitude: 0, latitude: 0 };
    }
}
Object.defineProperty(MapLine, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "MapLine"
});
Object.defineProperty(MapLine, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Graphics.classNames.concat([MapLine.className])
});
//# sourceMappingURL=MapLine.js.map