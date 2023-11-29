import { Graphics } from "../../core/render/Graphics";
import * as $mapUtils from "./MapUtils";
import $polylabel from "polylabel";
import { geoArea } from "d3-geo";
/**
 * A polygon in a [[MapPolygonSeries]].
 */
export class MapPolygon extends Graphics {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_projectionDirty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * A [[MapPolygonSeries]] polygon belongs to.
         */
        Object.defineProperty(this, "series", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _beforeChanged() {
        super._beforeChanged();
        if (this._projectionDirty || this.isDirty("geometry") || this.isDirty("precision")) {
            const geometry = this.get("geometry");
            if (geometry) {
                const series = this.series;
                if (series) {
                    const projection = series.projection();
                    if (projection) {
                        projection.precision(this.get("precision", 0.5));
                    }
                    const geoPath = series.geoPath();
                    if (geoPath) {
                        this._clear = true;
                        this.set("draw", (_display) => {
                            geoPath.context(this._display);
                            geoPath(geometry);
                            geoPath.context(null);
                        });
                        if (this.isHover()) {
                            this.showTooltip();
                        }
                    }
                }
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
    /**
     * Returns latitude/longitude of the geometrical center of the polygon.
     *
     * @return Center
     */
    geoCentroid() {
        const geometry = this.get("geometry");
        if (geometry) {
            return $mapUtils.getGeoCentroid(geometry);
        }
        else {
            return { latitude: 0, longitude: 0 };
        }
    }
    /**
     * Returns latitude/longitude of the visual center of the polygon.
     *
     * @return Center
     */
    visualCentroid() {
        let biggestArea = 0;
        let coordinates = [];
        const geometry = this.get("geometry");
        if (geometry) {
            if (geometry.type == "Polygon") {
                coordinates = geometry.coordinates;
            }
            else if (geometry.type == "MultiPolygon") {
                for (let i = 0; i < geometry.coordinates.length; i++) {
                    let coords = geometry.coordinates[i];
                    let area = geoArea({ type: "Polygon", coordinates: coords });
                    if (area > biggestArea) {
                        coordinates = coords;
                        biggestArea = area;
                    }
                }
            }
            let center = $polylabel(coordinates);
            return { longitude: center[0], latitude: center[1] };
        }
        return { longitude: 0, latitude: 0 };
    }
    _getTooltipPoint() {
        const series = this.series;
        if (series) {
            const projection = series.projection();
            if (projection) {
                const geoPoint = this.visualCentroid();
                const xy = projection([geoPoint.longitude, geoPoint.latitude]);
                if (xy) {
                    return { x: xy[0], y: xy[1] };
                }
            }
        }
        return { x: 0, y: 0 };
    }
}
Object.defineProperty(MapPolygon, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "MapPolygon"
});
Object.defineProperty(MapPolygon, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Graphics.classNames.concat([MapPolygon.className])
});
//# sourceMappingURL=MapPolygon.js.map