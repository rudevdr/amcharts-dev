import { MapSeries } from "./MapSeries";
import { MapPolygon } from "./MapPolygon";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import * as $array from "../../core/util/Array";
import * as $mapUtils from "./MapUtils";
/**
 * Creates a map series for displaying polygons.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/} for more info
 * @important
 */
export class MapPolygonSeries extends MapSeries {
    constructor() {
        super(...arguments);
        /**
         * A [[ListTemplate]] of all polygons in series.
         *
         * `mapPolygons.template` can also be used to configure polygons.
         *
         * @default new ListTemplate<MapPolygon>
         */
        Object.defineProperty(this, "mapPolygons", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => MapPolygon._new(this._root, {}, [this.mapPolygons.template]))
        });
        Object.defineProperty(this, "_types", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["Polygon", "MultiPolygon"]
        });
    }
    /**
     * @ignore
     */
    makeMapPolygon(dataItem) {
        const mapPolygon = this.children.push(this.mapPolygons.make());
        mapPolygon._setDataItem(dataItem);
        this.mapPolygons.push(mapPolygon);
        return mapPolygon;
    }
    /**
     * @ignore
     */
    markDirtyProjection() {
        $array.each(this.dataItems, (dataItem) => {
            let mapPolygon = dataItem.get("mapPolygon");
            if (mapPolygon) {
                mapPolygon.markDirtyProjection();
            }
        });
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this.isDirty("fill")) {
            this.mapPolygons.template.set("fill", this.get("fill"));
        }
        if (this.isDirty("stroke")) {
            this.mapPolygons.template.set("stroke", this.get("stroke"));
        }
    }
    processDataItem(dataItem) {
        super.processDataItem(dataItem);
        let mapPolygon = dataItem.get("mapPolygon");
        if (!mapPolygon) {
            mapPolygon = this.makeMapPolygon(dataItem);
        }
        dataItem.set("mapPolygon", mapPolygon);
        let geometry = dataItem.get("geometry");
        if (geometry) {
            if (this.get("reverseGeodata")) {
                const coordinates = geometry.coordinates;
                if (coordinates) {
                    for (let x = 0; x < geometry.coordinates.length; x++) {
                        if (geometry.type == "MultiPolygon") {
                            for (let y = 0; y < geometry.coordinates[x].length; y++) {
                                geometry.coordinates[x][y].reverse();
                            }
                        }
                        else {
                            geometry.coordinates[x].reverse();
                        }
                    }
                }
            }
            mapPolygon.set("geometry", geometry);
        }
        mapPolygon.series = this;
        this._addGeometry(dataItem.get("geometry"), this);
    }
    /**
     * @ignore
     */
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        const mapPolygon = dataItem.get("mapPolygon");
        if (mapPolygon) {
            this.mapPolygons.removeValue(mapPolygon);
            mapPolygon.dispose();
        }
        this._removeGeometry(dataItem.get("geometry"));
    }
    /**
     * @ignore
     */
    _excludeDataItem(dataItem) {
        super._excludeDataItem(dataItem);
        const mapPolygon = dataItem.get("mapPolygon");
        if (mapPolygon) {
            mapPolygon.setPrivate("visible", false);
        }
    }
    /**
     * @ignore
     */
    _unexcludeDataItem(dataItem) {
        super._unexcludeDataItem(dataItem);
        const mapPolygon = dataItem.get("mapPolygon");
        if (mapPolygon) {
            mapPolygon.setPrivate("visible", true);
        }
    }
    /**
     * @ignore
     */
    _notIncludeDataItem(dataItem) {
        super._notIncludeDataItem(dataItem);
        const mapPolygon = dataItem.get("mapPolygon");
        if (mapPolygon) {
            mapPolygon.setPrivate("visible", false);
        }
    }
    /**
     * @ignore
     */
    _unNotIncludeDataItem(dataItem) {
        super._unNotIncludeDataItem(dataItem);
        const mapPolygon = dataItem.get("mapPolygon");
        if (mapPolygon) {
            mapPolygon.setPrivate("visible", true);
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
            const mapPolygon = dataItem.get("mapPolygon");
            if (mapPolygon) {
                mapPolygon.set("geometry", dataItem.get("geometry"));
            }
        }
    }
    /**
     * Centers and zooms in on the specific polygon.
     *
     * @param  dataItem  Target data item
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Zooming_to_clicked_object} for more info
     * @param  rotate If it's true, the map will rotate so that this polygon would be in the center. Mostly usefull with geoOrthographic projection.
     */
    zoomToDataItem(dataItem, rotate) {
        const polygon = dataItem.get("mapPolygon");
        if (polygon) {
            const geometry = polygon.get("geometry");
            const chart = this.chart;
            if (geometry && chart) {
                if (rotate) {
                    const centroid = $mapUtils.getGeoCentroid(geometry);
                    chart.rotate(-centroid.longitude, -centroid.latitude);
                    return chart.zoomToGeoBounds($mapUtils.getGeoBounds(geometry), undefined, -centroid.longitude, -centroid.latitude);
                }
                return chart.zoomToGeoBounds($mapUtils.getGeoBounds(geometry));
            }
        }
    }
}
Object.defineProperty(MapPolygonSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "MapPolygonSeries"
});
Object.defineProperty(MapPolygonSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: MapSeries.classNames.concat([MapPolygonSeries.className])
});
//# sourceMappingURL=MapPolygonSeries.js.map