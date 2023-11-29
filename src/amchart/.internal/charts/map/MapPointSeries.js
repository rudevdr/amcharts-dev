import { MapSeries } from "./MapSeries";
import * as $array from "../../core/util/Array";
import * as $type from "../../core/util/Type";
import * as $math from "../../core/util/Math";
;
/**
 * Creates a map series for displaying markers on the map.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-point-series/} for more info
 * @important
 */
export class MapPointSeries extends MapSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_types", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["Point", "MultiPoint"]
        });
        Object.defineProperty(this, "_lineChangedDp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _afterNew() {
        this.fields.push("polygonId", "lineId", "longitude", "latitude", "fixed");
        super._afterNew();
    }
    /**
     * @ignore
     */
    markDirtyProjection() {
        this.markDirty();
    }
    /**
     * Forces a repaint of the element which relies on data.
     *
     * @since 5.0.21
     */
    markDirtyValues(dataItem) {
        super.markDirtyValues();
        if (dataItem) {
            this._positionBullets(dataItem);
        }
    }
    processDataItem(dataItem) {
        super.processDataItem(dataItem);
        let geometry = dataItem.get("geometry");
        if (!geometry) {
            geometry = { type: "Point", coordinates: [dataItem.get("longitude", 0), dataItem.get("latitude", 0)] };
            dataItem.set("geometry", geometry);
        }
        else {
            if (geometry.type == "Point") {
                const coordinates = geometry.coordinates;
                if (coordinates) {
                    dataItem.set("longitude", coordinates[0]);
                    dataItem.set("latitude", coordinates[1]);
                }
            }
            else if (geometry.type == "MultiPoint") {
                const coordinates = geometry.coordinates;
                if (coordinates && coordinates[0]) {
                    dataItem.set("longitude", coordinates[0][0]);
                    dataItem.set("latitude", coordinates[0][1]);
                }
            }
        }
        this._addGeometry(geometry, this);
    }
    _makeBullets(dataItem) {
        dataItem.bullets = [];
        this.bullets.each((bulletFunction) => {
            const geometry = dataItem.get("geometry");
            if (geometry) {
                if (geometry.type == "Point") {
                    this._setBulletParent(this._makeBullet(dataItem, bulletFunction));
                }
                else if (geometry.type = "MultiPoint") {
                    let i = 0;
                    $array.each(geometry.coordinates, () => {
                        this._setBulletParent(this._makeBullet(dataItem, bulletFunction, i));
                        i++;
                    });
                }
            }
        });
    }
    _setBulletParent(bullet) {
        if (bullet) {
            const sprite = bullet.get("sprite");
            const chart = this.chart;
            if (sprite && chart) {
                const dataItem = sprite.dataItem;
                if (dataItem) {
                    if (dataItem.get("fixed")) {
                        if (sprite.parent != chart.bulletsContainer) {
                            chart.bulletsContainer.children.moveValue(sprite);
                        }
                    }
                    else {
                        if (sprite.parent != this.bulletsContainer) {
                            this.bulletsContainer.children.moveValue(sprite);
                        }
                    }
                }
            }
        }
    }
    _positionBullet(bullet) {
        const sprite = bullet.get("sprite");
        if (sprite) {
            const dataItem = sprite.dataItem;
            if (dataItem && dataItem.get("fixed")) {
                return;
            }
            const latitude = dataItem.get("latitude");
            const longitude = dataItem.get("longitude");
            const lineDataItem = dataItem.get("lineDataItem");
            const fixed = dataItem.get("fixed");
            const chart = this.chart;
            let line;
            if (lineDataItem) {
                line = lineDataItem.get("mapLine");
            }
            else {
                const lineId = dataItem.get("lineId");
                if (lineId && chart) {
                    chart.series.each((series) => {
                        if (series.isType("MapLineSeries")) {
                            let lineDI = series.getDataItemById(lineId);
                            if (lineDI) {
                                dataItem.set("lineDataItem", lineDI);
                                line = lineDI.get("mapLine");
                            }
                        }
                    });
                }
            }
            if (this._lineChangedDp) {
                this._lineChangedDp.dispose();
            }
            if (line) {
                this._lineChangedDp = line.events.on("linechanged", () => {
                    this._positionBullets(dataItem);
                });
            }
            const polygonDataItem = dataItem.get("polygonDataItem");
            let polygon;
            if (polygonDataItem) {
                polygon = polygonDataItem.get("mapPolygon");
            }
            else {
                const polygonId = dataItem.get("polygonId");
                if (polygonId && chart) {
                    chart.series.each((series) => {
                        if (series.isType("MapPolygonSeries")) {
                            let polygonDI = series.getDataItemById(polygonId);
                            if (polygonDI) {
                                dataItem.set("polygonDataItem", polygonDI);
                                polygon = polygonDI.get("mapPolygon");
                            }
                        }
                    });
                }
            }
            const positionOnLine = dataItem.get("positionOnLine");
            let coordinates;
            let angle;
            if (polygon) {
                let geoPoint = polygon.visualCentroid();
                coordinates = [geoPoint.longitude, geoPoint.latitude];
                dataItem.setRaw("longitude", geoPoint.longitude);
                dataItem.setRaw("latitude", geoPoint.latitude);
            }
            else if (line && $type.isNumber(positionOnLine)) {
                let geoPoint = line.positionToGeoPoint(positionOnLine);
                coordinates = [geoPoint.longitude, geoPoint.latitude];
                if (dataItem.get("autoRotate", bullet.get("autoRotate")) && chart) {
                    const geoPoint0 = line.positionToGeoPoint(positionOnLine - 0.002);
                    const geoPoint1 = line.positionToGeoPoint(positionOnLine + 0.002);
                    const point0 = chart.convert(geoPoint0);
                    const point1 = chart.convert(geoPoint1);
                    //dataItem.set("autoRotateAngle", $math.getAngle(point0, point1));
                    angle = $math.getAngle(point0, point1);
                }
                dataItem.setRaw("longitude", geoPoint.longitude);
                dataItem.setRaw("latitude", geoPoint.latitude);
            }
            else if ($type.isNumber(longitude) && $type.isNumber(latitude)) {
                coordinates = [longitude, latitude];
            }
            else {
                const geometry = dataItem.get("geometry");
                if (geometry) {
                    if (geometry.type == "Point") {
                        this._positionBulletReal(bullet, geometry, geometry.coordinates, angle);
                    }
                    else if (geometry.type == "MultiPoint") {
                        let index = bullet._index || 0;
                        coordinates = geometry.coordinates[index];
                    }
                }
            }
            if (!fixed && coordinates) {
                this._positionBulletReal(bullet, { type: "Point", coordinates: coordinates }, coordinates, angle);
            }
        }
    }
    _positionBulletReal(bullet, geometry, coordinates, angle) {
        const sprite = bullet.get("sprite");
        const chart = this.chart;
        if (chart) {
            const projection = chart.get("projection");
            const geoPath = chart.getPrivate("geoPath");
            const dataItem = sprite.dataItem;
            const xy = projection(coordinates);
            if (xy) {
                const point = { x: xy[0], y: xy[1] };
                sprite.setAll(point);
                dataItem.setRaw("point", point);
            }
            let visible = true;
            if (geoPath(geometry)) {
                if (this.get("clipFront")) {
                    visible = false;
                }
            }
            else {
                if (this.get("clipBack")) {
                    visible = false;
                }
            }
            sprite.setPrivate("visible", visible);
            dataItem.set("clipped", !visible);
            if (dataItem && angle != null && dataItem.get("autoRotate", bullet.get("autoRotate"))) {
                sprite.set("rotation", angle + dataItem.get("autoRotateAngle", bullet.get("autoRotateAngle", 0)));
            }
        }
    }
    /**
     * Centers the map to specific series' data item and zooms to the level
     * specified in the parameters.
     *
     * @param  dataItem   Map point
     * @param  zoomLevel  Zoom level
     * @param  rotate If it's true, the map will rotate so that this point would be in the center. Mostly usefull with geoOrthographic projection.
     */
    zoomToDataItem(dataItem, zoomLevel, rotate) {
        const chart = this.chart;
        if (chart) {
            const longitude = dataItem.get("longitude", 0);
            const latitude = dataItem.get("latitude", 0);
            if (rotate) {
                return chart.zoomToGeoPoint({ longitude: longitude, latitude: latitude }, zoomLevel, true, undefined, -longitude, -latitude);
            }
            return chart.zoomToGeoPoint({ longitude: longitude, latitude: latitude }, zoomLevel, true);
        }
    }
    /**
     * Zooms the map in so that all points in the array are visible.
     *
     * @param   dataItems  An array of data items of points to zoom to
     * @param   rotate     Rotate the map so it is centered on the selected items
     * @return             Animation
     * @since 5.5.6
     */
    zoomToDataItems(dataItems, rotate) {
        let left = null;
        let right = null;
        let top = null;
        let bottom = null;
        $array.each(dataItems, (dataItem) => {
            const longitude = dataItem.get("longitude", 0);
            const latitude = dataItem.get("latitude", 0);
            if (left == null || left > longitude) {
                left = longitude;
            }
            if (right == null || right < longitude) {
                right = longitude;
            }
            if (top == null || top < latitude) {
                top = latitude;
            }
            if (bottom == null || bottom > latitude) {
                bottom = latitude;
            }
        });
        if (left != null && right != null && top != null && bottom != null) {
            const chart = this.chart;
            if (chart) {
                if (rotate) {
                    return chart.zoomToGeoBounds({ left, right, top, bottom }, undefined, -(left + (right - left) / 2), -(top + (top - bottom) / 2));
                }
                return chart.zoomToGeoBounds({ left, right, top, bottom });
            }
        }
    }
    /**
     * @ignore
     */
    disposeDataItem(dataItem) {
        const chart = this.chart;
        if (chart) {
            chart.series.each((series) => {
                if (series.isType("MapLineSeries")) {
                    $array.each(series.dataItems, (di) => {
                        const pointsToConnect = di.get("pointsToConnect");
                        if (pointsToConnect) {
                            $array.each(pointsToConnect, (point) => {
                                if (point == dataItem) {
                                    $array.remove(pointsToConnect, point);
                                    series.markDirtyValues(di);
                                }
                            });
                        }
                    });
                }
            });
        }
        super.disposeDataItem(dataItem);
    }
    /**
     * @ignore
     */
    _excludeDataItem(dataItem) {
        super._excludeDataItem(dataItem);
        const bullets = dataItem.bullets;
        if (bullets) {
            $array.each(bullets, (bullet) => {
                const sprite = bullet.get("sprite");
                if (sprite) {
                    sprite.setPrivate("visible", false);
                }
            });
        }
    }
    /**
     * @ignore
     */
    _unexcludeDataItem(dataItem) {
        super._unexcludeDataItem(dataItem);
        const bullets = dataItem.bullets;
        if (bullets) {
            $array.each(bullets, (bullet) => {
                const sprite = bullet.get("sprite");
                if (sprite) {
                    sprite.setPrivate("visible", true);
                }
            });
        }
    }
    /**
     * @ignore
     */
    _notIncludeDataItem(dataItem) {
        super._notIncludeDataItem(dataItem);
        const bullets = dataItem.bullets;
        if (bullets) {
            $array.each(bullets, (bullet) => {
                const sprite = bullet.get("sprite");
                if (sprite) {
                    sprite.setPrivate("visible", false);
                }
            });
        }
    }
    /**
     * @ignore
     */
    _unNotIncludeDataItem(dataItem) {
        super._unNotIncludeDataItem(dataItem);
        const bullets = dataItem.bullets;
        if (bullets) {
            $array.each(bullets, (bullet) => {
                const sprite = bullet.get("sprite");
                if (sprite) {
                    sprite.setPrivate("visible", true);
                }
            });
        }
    }
}
Object.defineProperty(MapPointSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "MapPointSeries"
});
Object.defineProperty(MapPointSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: MapSeries.classNames.concat([MapPointSeries.className])
});
//# sourceMappingURL=MapPointSeries.js.map