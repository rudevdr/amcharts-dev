import { MapPointSeries } from "./MapPointSeries";
import { DataItem } from "../../core/render/Component";
import { Container } from "../../core/render/Container";
import { Label } from "../../core/render/Label";
import * as $array from "../../core/util/Array";
import * as $object from "../../core/util/Object";
import * as d3hierarchy from "d3-hierarchy";
import * as $math from "../../core/util/Math";
/**
 * A version of [[MapPointSeries]] which can automatically group closely located
 * bullets into groups.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/clustered-point-series/} for more info
 * @since 5.5.6
 * @important
 */
export class ClusteredPointSeries extends MapPointSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_dataItem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.makeDataItem({})
        });
        Object.defineProperty(this, "_clusterIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_clusters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "clusteredDataItems", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_scatterIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_scatters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_packLayout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: d3hierarchy.pack()
        });
        Object.defineProperty(this, "_spiral", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    _afterNew() {
        this.fields.push("groupId");
        this._setRawDefault("groupIdField", "groupId");
        super._afterNew();
    }
    _updateChildren() {
        super._updateChildren();
        if (this.isDirty("scatterRadius")) {
            this._spiral = $math.spiralPoints(0, 0, 300, 300, 0, 3, 3, 0, 0);
        }
        const groups = {};
        // distribute to groups
        $array.each(this.dataItems, (dataItem) => {
            const groupId = dataItem.get("groupId", "_default");
            if (!groups[groupId]) {
                groups[groupId] = [];
            }
            groups[groupId].push(dataItem);
        });
        this._scatterIndex = -1;
        this._scatters = [];
        this._clusterIndex = -1;
        this._clusters = [];
        $array.each(this.clusteredDataItems, (dataItem) => {
            dataItem.setRaw("children", undefined);
        });
        $array.each(this.dataItems, (dataItem) => {
            dataItem.setRaw("cluster", undefined);
        });
        $object.each(groups, (_key, group) => {
            this._scatterGroup(group);
        });
        $object.each(groups, (_key, group) => {
            this._clusterGroup(group);
        });
        $array.each(this.dataItems, (dataItem) => {
            if (!dataItem.get("cluster")) {
                const bullets = dataItem.bullets;
                if (bullets) {
                    $array.each(bullets, (bullet) => {
                        const sprite = bullet.get("sprite");
                        if (sprite) {
                            sprite.set("forceHidden", false);
                        }
                    });
                }
            }
        });
    }
    /**
     * Zooms to the area so that all clustered data items of a cluster would be
     * visible.
     *
     * Pass in `true` as a second parameter to rotate that map so that the group
     * is in the center. This is especially useful in the maps that use
     * Orthographic (globe) projection.
     *
     * @param  dataItem  Group data item
     * @param  rotate    Rotate the map so that group is in the center?
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/clustered-point-series/#Drill_down} for more info
     */
    zoomToCluster(dataItem, rotate) {
        this.zoomToDataItems(dataItem.get("children", []), rotate);
    }
    _clusterGroup(dataItems) {
        const chart = this.chart;
        if (chart && chart.get("zoomLevel", 1) >= chart.get("maxZoomLevel", 100) * this.get("stopClusterZoom", 0.95)) {
            // void
        }
        else {
            while (dataItems.length > 0) {
                this._clusterIndex++;
                this._clusters[this._clusterIndex] = [];
                const cluster = this._clusters[this._clusterIndex];
                const dataItem = dataItems[0];
                cluster.push(dataItem);
                $array.remove(dataItems, dataItem);
                this._clusterDataItem(dataItem, dataItems);
            }
        }
        let i = 0;
        $array.each(this._clusters, (cluster) => {
            let sumX = 0;
            let sumY = 0;
            let len = cluster.length;
            if (len > 1) {
                let clusteredDataItem = this.clusteredDataItems[i];
                if (!clusteredDataItem) {
                    clusteredDataItem = new DataItem(this, undefined, {});
                    const bulletMethod = this.get("clusteredBullet");
                    if (bulletMethod) {
                        const bullet = clusteredDataItem.set("bullet", bulletMethod(this._root, this, clusteredDataItem));
                        if (bullet) {
                            const sprite = bullet.get("sprite");
                            if (sprite) {
                                this.bulletsContainer.children.push(sprite);
                                sprite._setDataItem(clusteredDataItem);
                            }
                        }
                    }
                    this.clusteredDataItems.push(clusteredDataItem);
                }
                $array.each(cluster, (dataItem) => {
                    dataItem.setRaw("cluster", clusteredDataItem);
                    const point = dataItem.get("point");
                    if (point) {
                        sumX += point.x;
                        sumY += point.y;
                    }
                    const bullets = dataItem.bullets;
                    if (bullets) {
                        $array.each(bullets, (bullet) => {
                            const sprite = bullet.get("sprite");
                            if (sprite) {
                                sprite.set("forceHidden", true);
                            }
                        });
                    }
                });
                let averageX = sumX / len;
                let averageY = sumY / len;
                clusteredDataItem.setRaw("children", cluster);
                const prevLen = clusteredDataItem.get("value");
                clusteredDataItem.setRaw("value", len);
                const bullet = clusteredDataItem.get("bullet");
                if (bullet) {
                    const sprite = bullet.get("sprite");
                    if (sprite) {
                        sprite.set("forceHidden", false);
                        sprite.setAll({ x: averageX, y: averageY });
                        if (prevLen != len) {
                            if (sprite instanceof Container) {
                                sprite.walkChildren((child) => {
                                    if (child instanceof Label) {
                                        child.text.markDirtyText();
                                    }
                                });
                            }
                        }
                    }
                }
                i++;
            }
        });
        $array.each(this.clusteredDataItems, (dataItem) => {
            let children = dataItem.get("children");
            if (!children || children.length == 0) {
                const bullet = dataItem.get("bullet");
                if (bullet) {
                    const sprite = bullet.get("sprite");
                    if (sprite) {
                        sprite.set("forceHidden", true);
                    }
                }
            }
        });
    }
    _clusterDataItem(dataItem, dataItems) {
        const point = dataItem.get("point");
        if (point) {
            $array.each(dataItems, (di) => {
                if (di && !di.get("clipped")) {
                    const diPoint = di.get("point");
                    if (diPoint) {
                        if (Math.hypot(diPoint.x - point.x, diPoint.y - point.y) < this.get("minDistance", 20)) {
                            const cluster = this._clusters[this._clusterIndex];
                            cluster.push(di);
                            $array.remove(dataItems, di);
                            this._clusterDataItem(di, dataItems);
                        }
                    }
                }
            });
        }
    }
    _scatterGroup(dataItems) {
        const chart = this.chart;
        if (chart && chart.get("zoomLevel", 1) >= chart.get("maxZoomLevel", 100) * this.get("stopClusterZoom", 0.95)) {
            while (dataItems.length > 0) {
                this._scatterIndex++;
                this._scatters[this._scatterIndex] = [];
                const scatter = this._scatters[this._scatterIndex];
                const dataItem = dataItems[0];
                scatter.push(dataItem);
                $array.remove(dataItems, dataItem);
                this._scatterDataItem(dataItem, dataItems);
            }
            $array.each(this._scatters, (scatter) => {
                let len = scatter.length;
                if (len > 1) {
                    let previousCircles = [];
                    let s = 0;
                    let radius = this.get("scatterRadius", 8);
                    $array.each(scatter, (dataItem) => {
                        let spiralPoint = this._spiral[s];
                        let intersects = true;
                        if (previousCircles.length > 0) {
                            while (intersects) {
                                $array.each(previousCircles, (previousCircle) => {
                                    intersects = false;
                                    while ($math.circlesOverlap({ x: spiralPoint.x, y: spiralPoint.y, radius: radius }, previousCircle)) {
                                        s++;
                                        if (this._spiral[s] == undefined) {
                                            intersects = false;
                                        }
                                        else {
                                            intersects = true;
                                            spiralPoint = this._spiral[s];
                                        }
                                    }
                                });
                            }
                        }
                        const dx = spiralPoint.x;
                        const dy = spiralPoint.y;
                        previousCircles.push({ x: dx, y: dy, radius: radius });
                        dataItem.set("dx", dx);
                        dataItem.set("dy", dy);
                        const bullets = dataItem.bullets;
                        if (bullets) {
                            $array.each(bullets, (bullet) => {
                                const sprite = bullet.get("sprite");
                                if (sprite) {
                                    sprite.setAll({ dx: dx, dy: dy });
                                }
                            });
                        }
                    });
                }
            });
        }
    }
    _scatterDataItem(dataItem, dataItems) {
        const point = dataItem.get("point");
        if (point) {
            $array.each(dataItems, (di) => {
                if (di && !di.get("clipped")) {
                    const diPoint = di.get("point");
                    if (diPoint) {
                        if (Math.hypot(diPoint.x - point.x, diPoint.y - point.y) < this.get("scatterDistance", 5)) {
                            const scatter = this._scatters[this._scatterIndex];
                            scatter.push(di);
                            $array.remove(dataItems, di);
                            this._scatterDataItem(di, dataItems);
                        }
                    }
                }
            });
        }
    }
}
Object.defineProperty(ClusteredPointSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ClusteredPointSeries"
});
Object.defineProperty(ClusteredPointSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: MapPointSeries.classNames.concat([ClusteredPointSeries.className])
});
//# sourceMappingURL=ClusteredPointSeries.js.map