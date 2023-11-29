import { Series } from "../../core/render/Series";
import * as $array from "../../core/util/Array";
import * as $object from "../../core/util/Object";
/**
 * Base class for map series.
 */
export class MapSeries extends Series {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_types", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_geometries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_geoJSONparsed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_excluded", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_notIncluded", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    _afterNew() {
        this.fields.push("geometry", "geometryType");
        this._setRawDefault("geometryField", "geometry");
        this._setRawDefault("geometryTypeField", "geometryType");
        this._setRawDefault("idField", "id");
        this.on("geoJSON", (geoJSON) => {
            let previous = this._prevSettings.geoJSON;
            if (previous && previous != geoJSON) {
                this.data.clear();
            }
        });
        super._afterNew();
    }
    _handleDirties() {
        const geoJSON = this.get("geoJSON");
        let previous = this._prevSettings.geoJSON;
        if (previous && previous != geoJSON) {
            this._prevSettings.geoJSON = undefined;
            this._geoJSONparsed = false;
        }
        if (!this._geoJSONparsed) {
            this._parseGeoJSON();
            this._geoJSONparsed = true;
        }
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this._valuesDirty) {
            this._handleDirties();
        }
        if (this.isDirty("geoJSON") || this.isDirty("include") || this.isDirty("exclude")) {
            this._handleDirties();
            const chart = this.chart;
            const exclude = this.get("exclude");
            if (exclude) {
                if (chart) {
                    chart._centerLocation = null;
                }
                $array.each(exclude, (id) => {
                    const dataItem = this.getDataItemById(id);
                    if (dataItem) {
                        this._excludeDataItem(dataItem);
                    }
                });
            }
            if (!exclude || exclude.length == 0) {
                $array.each(this._excluded, (dataItem) => {
                    this._unexcludeDataItem(dataItem);
                });
                this._excluded = [];
            }
            const include = this.get("include");
            if (include) {
                if (chart) {
                    chart._centerLocation = null;
                }
                $array.each(this.dataItems, (dataItem) => {
                    const id = dataItem.get("id");
                    if (id && include.indexOf(id) == -1) {
                        this._notIncludeDataItem(dataItem);
                    }
                    else {
                        this._unNotIncludeDataItem(dataItem);
                    }
                });
            }
            if (!include) {
                $array.each(this._notIncluded, (dataItem) => {
                    this._unNotIncludeDataItem(dataItem);
                });
                this._notIncluded = [];
            }
        }
    }
    _excludeDataItem(dataItem) {
        this._removeGeometry(dataItem.get("geometry"));
        $array.move(this._excluded, dataItem);
    }
    _unexcludeDataItem(dataItem) {
        this._addGeometry(dataItem.get("geometry"), this);
    }
    _notIncludeDataItem(dataItem) {
        this._removeGeometry(dataItem.get("geometry"));
        $array.move(this._notIncluded, dataItem);
    }
    _unNotIncludeDataItem(dataItem) {
        this._addGeometry(dataItem.get("geometry"), this);
    }
    checkInclude(id, includes, excludes) {
        if (includes) {
            if (includes.length == 0) {
                return false;
            }
            else {
                if (includes.indexOf(id) == -1) {
                    return false;
                }
            }
        }
        if (excludes && excludes.length > 0) {
            if (excludes.indexOf(id) != -1) {
                return false;
            }
        }
        return true;
    }
    _parseGeoJSON() {
        const geoJSON = this.get("geoJSON");
        if (geoJSON) {
            let features;
            if (geoJSON.type == "FeatureCollection") {
                features = geoJSON.features;
            }
            else if (geoJSON.type == "Feature") {
                features = [geoJSON];
            }
            else if (["Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon"].indexOf(geoJSON.type) != -1) {
                features = [{ geometry: geoJSON }];
            }
            else {
                console.log("nothing found in geoJSON");
            }
            const geodataNames = this.get("geodataNames");
            if (features) {
                const idField = this.get("idField", "id");
                for (let i = 0, len = features.length; i < len; i++) {
                    let feature = features[i];
                    let geometry = feature.geometry;
                    if (geometry) {
                        let type = geometry.type;
                        let id = feature[idField];
                        if (geodataNames && geodataNames[id]) {
                            feature.properties.name = geodataNames[id];
                        }
                        if (this._types.indexOf(type) != -1) {
                            //if (!this.checkInclude(id, this.get("include"), this.get("exclude"))) {
                            //	continue;
                            //}
                            let dataItem;
                            if (id != null) {
                                // find data object in user-provided data
                                dataItem = $array.find(this.dataItems, (value) => {
                                    return value.get("id") == id;
                                });
                            }
                            let dataObject;
                            if (dataItem) {
                                dataObject = dataItem.dataContext;
                            }
                            // create one if not found
                            if (!dataItem) {
                                dataObject = { geometry: geometry, geometryType: type, madeFromGeoData: true };
                                dataObject[idField] = id;
                                this.data.push(dataObject);
                            }
                            // in case found
                            else {
                                // if user-provided object doesn't have points data provided in any way:
                                if (!dataObject.geometry) {
                                    dataObject.geometry = geometry;
                                    dataObject.geometryType = type;
                                    dataItem.set("geometry", geometry);
                                    dataItem.set("geometryType", type);
                                    this.processDataItem(dataItem);
                                }
                            }
                            // copy properties data to datacontext
                            $object.softCopyProperties(feature.properties, dataObject);
                        }
                    }
                }
            }
            const type = "geodataprocessed";
            if (this.events.isEnabled(type)) {
                this.events.dispatch(type, { type: type, target: this });
            }
        }
    }
    _placeBulletsContainer(_chart) {
        this.children.moveValue(this.bulletsContainer);
    }
    _removeBulletsContainer() {
    }
    /**
     * @ignore
     */
    projection() {
        const chart = this.chart;
        if (chart) {
            return chart.get("projection");
        }
    }
    /**
     * @ignore
     */
    geoPath() {
        const chart = this.chart;
        if (chart) {
            return chart.getPrivate("geoPath");
        }
    }
    _addGeometry(geometry, series) {
        if (geometry && series.get("affectsBounds", true)) {
            this._geometries.push(geometry);
            const chart = this.chart;
            if (chart) {
                chart.markDirtyGeometries();
            }
        }
    }
    _removeGeometry(geometry) {
        if (geometry) {
            $array.remove(this._geometries, geometry);
            const chart = this.chart;
            if (chart) {
                chart.markDirtyGeometries();
            }
        }
    }
    _dispose() {
        super._dispose();
        const chart = this.chart;
        if (chart) {
            chart.series.removeValue(this);
        }
    }
    _onDataClear() {
        super._onDataClear();
        this._geoJSONparsed = false;
        this._markDirtyKey("exclude");
    }
}
Object.defineProperty(MapSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "MapSeries"
});
Object.defineProperty(MapSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Series.classNames.concat([MapSeries.className])
});
//# sourceMappingURL=MapSeries.js.map