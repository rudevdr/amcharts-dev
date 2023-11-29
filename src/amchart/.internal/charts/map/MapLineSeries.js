import { MapSeries } from "./MapSeries";
import { MapLine } from "./MapLine";
import { ListTemplate } from "../../core/util/List";
import { Template } from "../../core/util/Template";
import * as $array from "../../core/util/Array";
/**
 * Creates a map series for displaying lines on the map.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-line-series/} for more info
 * @important
 */
export class MapLineSeries extends MapSeries {
    constructor() {
        super(...arguments);
        /**
         * A [[ListTemplate]] of all lines in series.
         *
         * `mapLines.template` can also be used to configure lines.
         *
         * @default new ListTemplate<MapLine>
         */
        Object.defineProperty(this, "mapLines", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => MapLine._new(this._root, {}, [this.mapLines.template]))
        });
        Object.defineProperty(this, "_types", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["LineString", "MultiLineString"]
        });
    }
    _afterNew() {
        this.fields.push("lineType");
        this._setRawDefault("lineTypeField", "lineType");
        super._afterNew();
    }
    /**
     * @ignore
     */
    makeMapLine(dataItem) {
        const mapLine = this.children.push(this.mapLines.make());
        mapLine._setDataItem(dataItem);
        this.mapLines.push(mapLine);
        return mapLine;
    }
    /**
     * @ignore
     */
    markDirtyProjection() {
        $array.each(this.dataItems, (dataItem) => {
            let mapLine = dataItem.get("mapLine");
            if (mapLine) {
                mapLine.markDirtyProjection();
            }
        });
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this.isDirty("stroke")) {
            this.mapLines.template.set("stroke", this.get("stroke"));
        }
    }
    processDataItem(dataItem) {
        super.processDataItem(dataItem);
        let mapLine = dataItem.get("mapLine");
        if (!mapLine) {
            mapLine = this.makeMapLine(dataItem);
        }
        this._handlePointsToConnect(dataItem);
        dataItem.on("pointsToConnect", () => {
            this._handlePointsToConnect(dataItem);
        });
        dataItem.set("mapLine", mapLine);
        this._addGeometry(dataItem.get("geometry"), this);
        mapLine.setPrivate("series", this);
    }
    _handlePointsToConnect(dataItem) {
        const pointsToConnect = dataItem.get("pointsToConnect");
        if (pointsToConnect) {
            $array.each(pointsToConnect, (point) => {
                point.on("geometry", () => {
                    this.markDirtyValues(dataItem);
                });
                point.on("longitude", () => {
                    this.markDirtyValues(dataItem);
                });
                point.on("latitude", () => {
                    this.markDirtyValues(dataItem);
                });
            });
            this.markDirtyValues(dataItem);
        }
    }
    /**
     * Forces a repaint of the element which relies on data.
     *
     * @since 5.0.21
     */
    markDirtyValues(dataItem) {
        super.markDirtyValues();
        if (dataItem) {
            const mapLine = dataItem.get("mapLine");
            if (mapLine) {
                const pointsToConnect = dataItem.get("pointsToConnect");
                if (pointsToConnect) {
                    let coordinates = [];
                    $array.each(pointsToConnect, (point) => {
                        const longitude = point.get("longitude");
                        const latitude = point.get("latitude");
                        if (longitude != null && latitude != null) {
                            coordinates.push([longitude, latitude]);
                        }
                        else {
                            const geometry = point.get("geometry");
                            if (geometry) {
                                const coords = geometry.coordinates;
                                if (coords) {
                                    coordinates.push([coords[0], coords[1]]);
                                }
                            }
                        }
                    });
                    let geometry = { type: "LineString", coordinates: coordinates };
                    dataItem.setRaw("geometry", geometry);
                    mapLine.set("geometry", geometry);
                }
                else {
                    mapLine.set("geometry", dataItem.get("geometry"));
                }
            }
        }
    }
    /**
     * @ignore
     */
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        const mapLine = dataItem.get("mapLine");
        if (mapLine) {
            this.mapLines.removeValue(mapLine);
            mapLine.dispose();
        }
    }
    /**
     * @ignore
     */
    _excludeDataItem(dataItem) {
        super._excludeDataItem(dataItem);
        const mapLine = dataItem.get("mapLine");
        if (mapLine) {
            mapLine.setPrivate("visible", false);
        }
    }
    /**
     * @ignore
     */
    _unexcludeDataItem(dataItem) {
        super._unexcludeDataItem(dataItem);
        const mapLine = dataItem.get("mapLine");
        if (mapLine) {
            mapLine.setPrivate("visible", true);
        }
    }
    /**
     * @ignore
     */
    _notIncludeDataItem(dataItem) {
        super._notIncludeDataItem(dataItem);
        const mapLine = dataItem.get("mapLine");
        if (mapLine) {
            mapLine.setPrivate("visible", false);
        }
    }
    /**
     * @ignore
     */
    _unNotIncludeDataItem(dataItem) {
        super._unNotIncludeDataItem(dataItem);
        const mapLine = dataItem.get("mapLine");
        if (mapLine) {
            mapLine.setPrivate("visible", true);
        }
    }
}
Object.defineProperty(MapLineSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "MapLineSeries"
});
Object.defineProperty(MapLineSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: MapSeries.classNames.concat([MapLineSeries.className])
});
//# sourceMappingURL=MapLineSeries.js.map