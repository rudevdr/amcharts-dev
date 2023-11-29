import { __awaiter } from "tslib";
import { XYSeries } from "./XYSeries";
import { Percent } from "../../../core/util/Percent";
import { visualSettings } from "../../../core/render/Graphics";
import * as $array from "../../../core/util/Array";
import * as $type from "../../../core/util/Type";
/**
 * Base class for all "column-based" series
 */
export class BaseColumnSeries extends XYSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_ph", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_pw", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
    }
    _makeGraphics(listTemplate, dataItem) {
        return this.makeColumn(dataItem, listTemplate);
    }
    _makeFieldNames() {
        super._makeFieldNames();
        const xAxis = this.get("xAxis");
        const yAxis = this.get("yAxis");
        const categoryAxis = "CategoryAxis";
        const valueAxis = "ValueAxis";
        if (xAxis.isType(categoryAxis)) {
            if (!this.get("openCategoryXField")) {
                this._xOpenField = this._xField;
            }
        }
        if (xAxis.isType(valueAxis)) {
            if (!this.get("openValueXField")) {
                this._xOpenField = this._xField;
            }
        }
        if (yAxis.isType(categoryAxis)) {
            if (!this.get("openCategoryYField")) {
                this._yOpenField = this._yField;
            }
        }
        if (yAxis.isType(valueAxis)) {
            if (!this.get("openValueYField")) {
                this._yOpenField = this._yField;
            }
        }
    }
    _prepareChildren() {
        super._prepareChildren();
        const xAxis = this.get("xAxis");
        const yAxis = this.get("yAxis");
        const len = this.dataItems.length;
        const startIndex = Math.max(0, this.startIndex() - 2);
        const endIndex = Math.min(this.endIndex() + 2, len - 1);
        if (xAxis.inited && yAxis.inited) {
            for (let i = startIndex; i <= endIndex; i++) {
                let dataItem = this.dataItems[i];
                this._createGraphics(dataItem);
            }
        }
    }
    _updateChildren() {
        const chart = this.chart;
        if (chart) {
            this._ph = chart.plotContainer.height();
            this._pw = chart.plotContainer.width();
        }
        const xAxis = this.get("xAxis");
        const yAxis = this.get("yAxis");
        const baseAxis = this.get("baseAxis");
        const columnsTemplate = this.columns.template;
        if (this.isDirty("fill")) {
            if (columnsTemplate.get("fill") == null) {
                columnsTemplate.set("fill", this.get("fill"));
            }
        }
        if (this.isDirty("stroke")) {
            if (columnsTemplate.get("stroke") == null) {
                columnsTemplate.set("stroke", this.get("stroke"));
            }
        }
        let index = 0;
        let clusterCount = 0;
        let i = 0;
        $array.each(baseAxis.series, (series) => {
            if (series instanceof BaseColumnSeries) {
                const stacked = series.get("stacked");
                if (stacked && i == 0) {
                    clusterCount++;
                }
                if (!stacked && series.get("clustered")) {
                    clusterCount++;
                }
            }
            if (series === this) {
                index = clusterCount - 1;
            }
            i++;
        });
        if (!this.get("clustered")) {
            index = 0;
            clusterCount = 1;
        }
        if (clusterCount === 0) {
            clusterCount = 1;
            index = 0;
        }
        const xRenderer = xAxis.get("renderer");
        const yRenderer = yAxis.get("renderer");
        const cellStartLocation = "cellStartLocation";
        const cellEndLocation = "cellEndLocation";
        const cellLocationX0 = xRenderer.get(cellStartLocation, 0);
        const cellLocationX1 = xRenderer.get(cellEndLocation, 1);
        const cellLocationY0 = yRenderer.get(cellStartLocation, 0);
        const cellLocationY1 = yRenderer.get(cellEndLocation, 1);
        this._aLocationX0 = cellLocationX0 + (index / clusterCount) * (cellLocationX1 - cellLocationX0);
        this._aLocationX1 = cellLocationX0 + (index + 1) / clusterCount * (cellLocationX1 - cellLocationX0);
        ;
        this._aLocationY0 = cellLocationY0 + (index / clusterCount) * (cellLocationY1 - cellLocationY0);
        this._aLocationY1 = cellLocationY0 + (index + 1) / clusterCount * (cellLocationY1 - cellLocationY0);
        if (xAxis.inited && yAxis.inited) {
            if (this._axesDirty || this._valuesDirty || this._stackDirty || this.isDirty("vcx") || this.isDirty("vcy") || this._sizeDirty) {
                const len = this.dataItems.length;
                let startIndex = Math.max(0, this.startIndex() - 2);
                let endIndex = Math.min(this.endIndex() + 2, len - 1);
                for (let i = 0; i < startIndex; i++) {
                    this._toggleColumn(this.dataItems[i], false);
                }
                let previous = this.dataItems[startIndex];
                for (let i = startIndex; i <= endIndex; i++) {
                    let dataItem = this.dataItems[i];
                    if (dataItem.get("valueX") != null && dataItem.get("valueY") != null) {
                        previous = dataItem;
                        if (i > 0 && startIndex > 0) {
                            for (let j = i - 1; j >= 0; j--) {
                                let dataItem = this.dataItems[j];
                                if (dataItem.get("valueX") != null && dataItem.get("valueY") != null) {
                                    previous = dataItem;
                                    break;
                                }
                            }
                        }
                        break;
                    }
                    else {
                        this._toggleColumn(dataItem, false);
                    }
                }
                for (let i = startIndex; i <= endIndex; i++) {
                    let dataItem = this.dataItems[i];
                    this._updateGraphics(dataItem, previous);
                    if (dataItem.get("valueX") != null && dataItem.get("valueY") != null) {
                        previous = dataItem;
                    }
                }
                for (let i = endIndex + 1; i < len; i++) {
                    this._toggleColumn(this.dataItems[i], false);
                }
            }
        }
        else {
            this._skipped = true;
        }
        this.updateLegendMarker(this.get("tooltipDataItem"));
        super._updateChildren();
    }
    _createGraphics(dataItem) {
        let graphics = dataItem.get("graphics");
        if (!graphics) {
            graphics = this._makeGraphics(this.columns, dataItem);
            dataItem.set("graphics", graphics);
            graphics._setDataItem(dataItem);
            const legendDataItem = dataItem.get("legendDataItem");
            if (legendDataItem) {
                const markerRectangle = legendDataItem.get("markerRectangle");
                if (markerRectangle) {
                    const ds = markerRectangle.states.lookup("default");
                    $array.each(visualSettings, (setting) => {
                        const value = graphics.get(setting, this.get(setting));
                        markerRectangle.set(setting, value);
                        ds.set(setting, value);
                    });
                }
            }
            let graphicsArray = dataItem.get("rangeGraphics");
            if (graphicsArray) {
                $array.each(graphicsArray, (graphics) => {
                    graphics.dispose();
                });
            }
            graphicsArray = [];
            dataItem.setRaw("rangeGraphics", graphicsArray);
            this.axisRanges.each((axisRange) => {
                const container = axisRange.container;
                const rangeGraphics = this._makeGraphics(axisRange.columns, dataItem);
                if (graphicsArray) {
                    graphicsArray.push(rangeGraphics);
                }
                rangeGraphics.setPrivate("list", axisRange.columns);
                container.children.push(rangeGraphics);
            });
        }
    }
    createAxisRange(axisDataItem) {
        $array.each(this.dataItems, (dataItem) => {
            const graphics = dataItem.get("graphics");
            if (graphics) {
                graphics.dispose();
                dataItem.set("graphics", undefined);
            }
        });
        return super.createAxisRange(axisDataItem);
    }
    _updateGraphics(dataItem, previousDataItem) {
        let graphics = dataItem.get("graphics");
        //if (!graphics) {
        //	this._createGraphics(dataItem);
        //	graphics = dataItem.get("graphics")!;
        //}
        const xField = this._xField;
        const yField = this._yField;
        const valueX = dataItem.get(xField);
        const valueY = dataItem.get(yField);
        if (valueX != null && valueY != null) {
            const xOpenField = this._xOpenField;
            const yOpenField = this._yOpenField;
            const locationX = this.get("locationX", dataItem.get("locationX", 0.5));
            const locationY = this.get("locationY", dataItem.get("locationY", 0.5));
            const openLocationX = this.get("openLocationX", dataItem.get("openLocationX", locationX));
            const openLocationY = this.get("openLocationY", dataItem.get("openLocationY", locationY));
            const width = graphics.get("width");
            const height = graphics.get("height");
            const stacked = this.get("stacked");
            const xAxis = this.get("xAxis");
            const yAxis = this.get("yAxis");
            const baseAxis = this.get("baseAxis");
            const xStart = xAxis.get("start");
            const xEnd = xAxis.get("end");
            const yStart = yAxis.get("start");
            const yEnd = yAxis.get("end");
            let l;
            let r;
            let t;
            let b;
            let vcy = this.get("vcy", 1);
            let vcx = this.get("vcx", 1);
            let fitW = false;
            let fitH = false;
            if (yAxis.isType("CategoryAxis") && xAxis.isType("CategoryAxis")) {
                let startLocation = this._aLocationX0 + openLocationX - 0.5;
                let endLocation = this._aLocationX1 + locationX - 0.5;
                if (width instanceof Percent) {
                    let offset = (endLocation - startLocation) * (1 - width.value) / 2;
                    startLocation += offset;
                    endLocation -= offset;
                }
                l = xAxis.getDataItemPositionX(dataItem, xOpenField, startLocation, vcx);
                r = xAxis.getDataItemPositionX(dataItem, xField, endLocation, vcx);
                startLocation = this._aLocationY0 + openLocationY - 0.5;
                endLocation = this._aLocationY1 + locationY - 0.5;
                if (height instanceof Percent) {
                    let offset = (endLocation - startLocation) * (1 - height.value) / 2;
                    startLocation += offset;
                    endLocation -= offset;
                }
                t = yAxis.getDataItemPositionY(dataItem, yOpenField, startLocation, vcy);
                b = yAxis.getDataItemPositionY(dataItem, yField, endLocation, vcy);
                dataItem.setRaw("point", { x: l + (r - l) / 2, y: t + (b - t) / 2 });
            }
            else if (xAxis === baseAxis) {
                let startLocation = this._aLocationX0 + openLocationX - 0.5;
                let endLocation = this._aLocationX1 + locationX - 0.5;
                if (width instanceof Percent) {
                    let offset = (endLocation - startLocation) * (1 - width.value) / 2;
                    startLocation += offset;
                    endLocation -= offset;
                }
                l = xAxis.getDataItemPositionX(dataItem, xOpenField, startLocation, vcx);
                r = xAxis.getDataItemPositionX(dataItem, xField, endLocation, vcx);
                t = yAxis.getDataItemPositionY(dataItem, yField, locationY, vcy);
                if (this._yOpenField !== this._yField) {
                    b = yAxis.getDataItemPositionY(dataItem, yOpenField, openLocationY, vcy);
                }
                else {
                    if (stacked) {
                        let stackToItemY = dataItem.get("stackToItemY");
                        if (stackToItemY) {
                            b = yAxis.getDataItemPositionY(stackToItemY, yField, openLocationY, stackToItemY.component.get("vcy"));
                        }
                        else {
                            b = yAxis.basePosition();
                        }
                    }
                    else {
                        b = yAxis.basePosition();
                    }
                }
                dataItem.setRaw("point", { x: l + (r - l) / 2, y: t });
                fitH = true;
            }
            else if (yAxis === baseAxis) {
                let startLocation = this._aLocationY0 + openLocationY - 0.5;
                let endLocation = this._aLocationY1 + locationY - 0.5;
                if (height instanceof Percent) {
                    let offset = (endLocation - startLocation) * (1 - height.value) / 2;
                    startLocation += offset;
                    endLocation -= offset;
                }
                t = yAxis.getDataItemPositionY(dataItem, yOpenField, startLocation, vcy);
                b = yAxis.getDataItemPositionY(dataItem, yField, endLocation, vcy);
                r = xAxis.getDataItemPositionX(dataItem, xField, locationX, vcx);
                if (this._xOpenField !== this._xField) {
                    l = xAxis.getDataItemPositionX(dataItem, xOpenField, openLocationX, vcx);
                }
                else {
                    if (stacked) {
                        let stackToItemX = dataItem.get("stackToItemX");
                        if (stackToItemX) {
                            l = xAxis.getDataItemPositionX(stackToItemX, xField, openLocationX, stackToItemX.component.get("vcx"));
                        }
                        else {
                            l = xAxis.basePosition();
                        }
                    }
                    else {
                        l = xAxis.basePosition();
                    }
                }
                fitW = true;
                dataItem.setRaw("point", { x: r, y: t + (b - t) / 2 });
            }
            this._updateSeriesGraphics(dataItem, graphics, l, r, t, b, fitW, fitH);
            if ((l < xStart && r < xStart) || (l > xEnd && r > xEnd) || (t < yStart && b <= yStart) || (t >= yEnd && b > yEnd) || $type.isNaN(l) || $type.isNaN(t)) {
                this._toggleColumn(dataItem, false);
            }
            else {
                this._toggleColumn(dataItem, true);
            }
            let rangeGraphics = dataItem.get("rangeGraphics");
            if (rangeGraphics) {
                $array.each(rangeGraphics, (graphics) => {
                    this._updateSeriesGraphics(dataItem, graphics, l, r, t, b, fitW, fitH);
                });
            }
            this._applyGraphicsStates(dataItem, previousDataItem);
        }
    }
    _updateSeriesGraphics(dataItem, graphics, l, r, t, b, fitW, fitH) {
        const width = graphics.get("width");
        const height = graphics.get("height");
        const maxWidth = graphics.get("maxWidth");
        const maxHeight = graphics.get("maxHeight");
        const ptl = this.getPoint(l, t);
        const pbr = this.getPoint(r, b);
        const tooltipPoint = dataItem.get("point");
        if (tooltipPoint) {
            const point = this.getPoint(tooltipPoint.x, tooltipPoint.y);
            tooltipPoint.x = point.x + this._x;
            tooltipPoint.y = point.y + this._y;
        }
        l = ptl.x;
        r = pbr.x;
        t = ptl.y;
        b = pbr.y;
        if ($type.isNumber(width)) {
            const offset = ((r - l) - width) / 2;
            l += offset;
            r -= offset;
        }
        if ($type.isNumber(maxWidth) && maxWidth < Math.abs(r - l)) {
            const offset = ((r - l) - maxWidth) / 2;
            l += offset;
            r -= offset;
        }
        if ($type.isNumber(height)) {
            const offset = ((b - t) - height) / 2;
            t += offset;
            b -= offset;
        }
        if ($type.isNumber(maxHeight) && maxHeight < Math.abs(b - t)) {
            const offset = ((b - t) - maxHeight) / 2;
            t += offset;
            b -= offset;
        }
        if (this.get("adjustBulletPosition")) {
            if (fitW) {
                r = Math.min(Math.max(0, r), this._pw);
                l = Math.min(Math.max(0, l), this._pw);
            }
            if (fitH) {
                t = Math.min(Math.max(0, t), this._ph);
                b = Math.min(Math.max(0, b), this._ph);
            }
        }
        dataItem.setRaw("left", l);
        dataItem.setRaw("right", r);
        dataItem.setRaw("top", t);
        dataItem.setRaw("bottom", b);
        graphics.setPrivate("width", r - l);
        graphics.setPrivate("height", b - t);
        graphics.set("x", l);
        graphics.set("y", b - (b - t));
    }
    _handleDataSetChange() {
        super._handleDataSetChange();
        $array.each(this._dataItems, (dataItem) => {
            this._toggleColumn(dataItem, false);
        });
    }
    _applyGraphicsStates(dataItem, previousDataItem) {
        const graphics = dataItem.get("graphics");
        const dropFromOpen = graphics.states.lookup("dropFromOpen");
        const riseFromOpen = graphics.states.lookup("riseFromOpen");
        const dropFromPrevious = graphics.states.lookup("dropFromPrevious");
        const riseFromPrevious = graphics.states.lookup("riseFromPrevious");
        if (dropFromOpen || dropFromPrevious || riseFromOpen || riseFromPrevious) {
            const xAxis = this.get("xAxis");
            const yAxis = this.get("yAxis");
            const baseAxis = this.get("baseAxis");
            let open;
            let close;
            let previousClose;
            if (baseAxis === xAxis && yAxis.isType("ValueAxis")) {
                open = dataItem.get(this._yOpenField);
                close = dataItem.get(this._yField);
                previousClose = previousDataItem.get(this._yField);
            }
            else if (baseAxis === yAxis && xAxis.isType("ValueAxis")) {
                open = dataItem.get(this._xOpenField);
                close = dataItem.get(this._xField);
                previousClose = previousDataItem.get(this._xField);
            }
            if ($type.isNumber(open) && $type.isNumber(close)) {
                if (close < open) {
                    if (dropFromOpen) {
                        dropFromOpen.apply();
                    }
                }
                else {
                    if (riseFromOpen) {
                        riseFromOpen.apply();
                    }
                }
                if ($type.isNumber(previousClose)) {
                    if (close < previousClose) {
                        if (dropFromPrevious) {
                            dropFromPrevious.apply();
                        }
                    }
                    else {
                        if (riseFromPrevious) {
                            riseFromPrevious.apply();
                        }
                    }
                }
            }
        }
    }
    /**
     * @ignore
     */
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        const graphics = dataItem.get("graphics");
        if (graphics) {
            this.columns.removeValue(graphics);
            graphics.dispose();
        }
        const rangeGraphics = dataItem.get("rangeGraphics");
        if (rangeGraphics) {
            $array.each(rangeGraphics, (graphics) => {
                const list = graphics.getPrivate("list");
                if (list) {
                    list.removeValue(graphics);
                }
                graphics.dispose();
            });
        }
    }
    /**
     * Hides series's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    hideDataItem(dataItem, duration) {
        const _super = Object.create(null, {
            hideDataItem: { get: () => super.hideDataItem }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [_super.hideDataItem.call(this, dataItem, duration)];
            const graphics = dataItem.get("graphics");
            if (graphics) {
                promises.push(graphics.hide(duration));
            }
            const rangeGraphics = dataItem.get("rangeGraphics");
            if (rangeGraphics) {
                $array.each(rangeGraphics, (graphics) => {
                    promises.push(graphics.hide(duration));
                });
            }
            yield Promise.all(promises);
        });
    }
    _toggleColumn(dataItem, visible) {
        const graphics = dataItem.get("graphics");
        if (graphics) {
            graphics.setPrivate("visible", visible);
        }
        const rangeGraphics = dataItem.get("rangeGraphics");
        if (rangeGraphics) {
            $array.each(rangeGraphics, (graphics) => {
                graphics.setPrivate("visible", visible);
            });
        }
        const bullets = dataItem.bullets;
        if (bullets) {
            $array.each(bullets, (bullet) => {
                bullet.setPrivate("hidden", !visible);
            });
        }
    }
    /**
     * Shows series's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    showDataItem(dataItem, duration) {
        const _super = Object.create(null, {
            showDataItem: { get: () => super.showDataItem }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [_super.showDataItem.call(this, dataItem, duration)];
            const graphics = dataItem.get("graphics");
            if (graphics) {
                promises.push(graphics.show(duration));
            }
            const rangeGraphics = dataItem.get("rangeGraphics");
            if (rangeGraphics) {
                $array.each(rangeGraphics, (graphics) => {
                    promises.push(graphics.show(duration));
                });
            }
            yield Promise.all(promises);
        });
    }
    /**
     * @ignore
     */
    updateLegendMarker(dataItem) {
        let legendDataItem = this.get("legendDataItem");
        if (this.get("useLastColorForLegendMarker")) {
            if (!dataItem) {
                const lastDataItem = this.dataItems[this.endIndex() - 1];
                if (lastDataItem) {
                    dataItem = lastDataItem;
                }
            }
        }
        if (legendDataItem) {
            let graphics = this.columns.template;
            if (dataItem) {
                let column = dataItem.get("graphics");
                if (column) {
                    graphics = column;
                }
            }
            const markerRectangle = legendDataItem.get("markerRectangle");
            if (markerRectangle) {
                if (!legendDataItem.get("itemContainer").get("disabled")) {
                    const ds = markerRectangle.states.lookup("default");
                    $array.each(visualSettings, (setting) => {
                        const value = graphics.get(setting, this.get(setting));
                        markerRectangle.set(setting, value);
                        ds.set(setting, value);
                    });
                }
            }
        }
    }
    _getTooltipTarget(dataItem) {
        if (this.get("seriesTooltipTarget") == "bullet") {
            return super._getTooltipTarget(dataItem);
        }
        let column = dataItem.get("graphics");
        if (column) {
            return column;
        }
        return this;
    }
}
Object.defineProperty(BaseColumnSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "BaseColumnSeries"
});
Object.defineProperty(BaseColumnSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: XYSeries.classNames.concat([BaseColumnSeries.className])
});
//# sourceMappingURL=BaseColumnSeries.js.map