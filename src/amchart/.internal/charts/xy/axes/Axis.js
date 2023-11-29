import { DataItem } from "../../../core/render/Component";
import { Component } from "../../../core/render/Component";
import { Container } from "../../../core/render/Container";
import { p100 } from "../../../core/util/Percent";
import { List } from "../../../core/util/List";
import { Rectangle } from "../../../core/render/Rectangle";
import * as $array from "../../../core/util/Array";
import * as $type from "../../../core/util/Type";
import * as $utils from "../../../core/util/Utils";
/**
 * A base class for all axes.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/#Adding_axes} for more info
 */
export class Axis extends Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_series", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_isPanning", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * Array of minor data items.
         */
        Object.defineProperty(this, "minorDataItems", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        /**
         * A [[Container]] that holds all the axis label elements.
         *
         * @default Container.new()
         */
        Object.defineProperty(this, "labelsContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Container.new(this._root, {}))
        });
        /**
         * A [[Container]] that holds all the axis grid and fill elements.
         *
         * @default Container.new()
         */
        Object.defineProperty(this, "gridContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Container.new(this._root, { width: p100, height: p100 })
        });
        /**
         * A [[Container]] that holds axis grid elements which goes above the series.
         *
         * @default Container.new()
         */
        Object.defineProperty(this, "topGridContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Container.new(this._root, { width: p100, height: p100 })
        });
        /**
         * A [[Container]] that holds all the axis bullet elements.
         *
         * @default new Container
         */
        Object.defineProperty(this, "bulletsContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Container.new(this._root, { isMeasured: false, width: p100, height: p100, position: "absolute" }))
        });
        /**
         * A referenece to the the chart the axis belongs to.
         */
        Object.defineProperty(this, "chart", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_rangesDirty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_panStart", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_panEnd", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "_sAnimation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_eAnimation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_skipSync", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * A list of axis ranges.
         *
         * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-ranges/} for more info
         * @default new List()
         */
        Object.defineProperty(this, "axisRanges", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new List()
        });
        Object.defineProperty(this, "_seriesAxisRanges", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        /**
         * A control label that is invisible but is used to keep width the width of
         * the axis constant.
         *
         * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Ghost_label} for more info
         */
        Object.defineProperty(this, "ghostLabel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_cursorPosition", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: -1
        });
        Object.defineProperty(this, "_snapToSeries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_seriesValuesDirty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * A container above the axis that can be used to add additional stuff into
         * it. For example a legend, label, or an icon.
         *
         * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-headers/} for more info
         * @default new Container
         */
        Object.defineProperty(this, "axisHeader", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Container.new(this._root, {
                themeTags: ["axis", "header"],
                position: "absolute",
                background: Rectangle.new(this._root, {
                    themeTags: ["header", "background"],
                    fill: this._root.interfaceColors.get("background")
                })
            }))
        });
        Object.defineProperty(this, "_bullets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
    }
    _dispose() {
        // these could be in other parents, so disposing just in case
        this.gridContainer.dispose();
        this.topGridContainer.dispose();
        this.bulletsContainer.dispose();
        this.labelsContainer.dispose();
        this.axisHeader.dispose();
        super._dispose();
    }
    _afterNew() {
        super._afterNew();
        this.setPrivate("updateScrollbar", true);
        this._disposers.push(this.axisRanges.events.onAll((change) => {
            if (change.type === "clear") {
                $array.each(change.oldValues, (dataItem) => {
                    this.disposeDataItem(dataItem);
                });
            }
            else if (change.type === "push") {
                this._processAxisRange(change.newValue, ["range"]);
            }
            else if (change.type === "setIndex") {
                this._processAxisRange(change.newValue, ["range"]);
            }
            else if (change.type === "insertIndex") {
                this._processAxisRange(change.newValue, ["range"]);
            }
            else if (change.type === "removeIndex") {
                this.disposeDataItem(change.oldValue);
            }
            else if (change.type === "moveIndex") {
                this._processAxisRange(change.value, ["range"]);
            }
            else {
                throw new Error("Unknown IStreamEvent type");
            }
        }));
        const renderer = this.get("renderer");
        if (renderer) {
            renderer.axis = this;
            renderer.processAxis();
        }
        this.children.push(renderer);
        this.ghostLabel = renderer.makeLabel(new DataItem(this, undefined, {}), []);
        this.ghostLabel.adapters.disable("text");
        this.ghostLabel.setAll({ opacity: 0, tooltipText: undefined, tooltipHTML: undefined, interactive: false });
        this.ghostLabel.events.disable();
    }
    _updateFinals(_start, _end) {
    }
    /**
     * Zooms the axis to relative locations.
     *
     * Both `start` and `end` are relative: 0 means start of the axis, 1 - end.
     *
     * @param   start     Relative start
     * @param   end       Relative end
     * @param   duration  Duration of the zoom animation in milliseconds
     * @return            Zoom animation
     */
    zoom(start, end, duration, priority) {
        this._updateFinals(start, end);
        if (this.get("start") !== start || this.get("end") != end) {
            let sAnimation = this._sAnimation;
            let eAnimation = this._eAnimation;
            let maxDeviation = this.get("maxDeviation", 0.5) * Math.min(1, (end - start));
            if (start < -maxDeviation) {
                start = -maxDeviation;
            }
            if (end > 1 + maxDeviation) {
                end = 1 + maxDeviation;
            }
            if (start > end) {
                [start, end] = [end, start];
            }
            if (!$type.isNumber(duration)) {
                duration = this.get("interpolationDuration", 0);
            }
            if (!priority) {
                priority = "end";
            }
            let maxZoomFactor = this.getPrivate("maxZoomFactor", this.get("maxZoomFactor", 100));
            let maxZoomFactorReal = maxZoomFactor;
            if (end === 1 && start !== 0) {
                if (start < this.get("start")) {
                    priority = "start";
                }
                else {
                    priority = "end";
                }
            }
            if (start === 0 && end !== 1) {
                if (end > this.get("end")) {
                    priority = "end";
                }
                else {
                    priority = "start";
                }
            }
            let minZoomCount = this.get("minZoomCount");
            let maxZoomCount = this.get("maxZoomCount");
            if ($type.isNumber(minZoomCount)) {
                maxZoomFactor = maxZoomFactorReal / minZoomCount;
            }
            let minZoomFactor = 1;
            if ($type.isNumber(maxZoomCount)) {
                minZoomFactor = maxZoomFactorReal / maxZoomCount;
            }
            // most likely we are dragging left scrollbar grip here, so we tend to modify end
            if (priority === "start") {
                if (maxZoomCount > 0) {
                    // add to the end
                    if (1 / (end - start) < minZoomFactor) {
                        end = start + 1 / minZoomFactor;
                    }
                }
                // add to the end
                if (1 / (end - start) > maxZoomFactor) {
                    end = start + 1 / maxZoomFactor;
                }
                //unless end is > 0
                if (end > 1 && end - start < 1 / maxZoomFactor) {
                    //end = 1;
                    start = end - 1 / maxZoomFactor;
                }
            }
            // most likely we are dragging right, so we modify left
            else {
                if (maxZoomCount > 0) {
                    // add to the end
                    if (1 / (end - start) < minZoomFactor) {
                        start = end - 1 / minZoomFactor;
                    }
                }
                // remove from start
                if (1 / (end - start) > maxZoomFactor) {
                    start = end - 1 / maxZoomFactor;
                }
                if (start < 0 && end - start < 1 / maxZoomFactor) {
                    //start = 0;
                    end = start + 1 / maxZoomFactor;
                }
            }
            if (1 / (end - start) > maxZoomFactor) {
                end = start + 1 / maxZoomFactor;
            }
            if (1 / (end - start) > maxZoomFactor) {
                start = end - 1 / maxZoomFactor;
            }
            if (maxZoomCount != null && minZoomCount != null && (start == this.get("start") && end == this.get("end"))) {
                const chart = this.chart;
                if (chart) {
                    chart._handleAxisSelection(this, true);
                }
            }
            if (((sAnimation && sAnimation.playing && sAnimation.to == start) || this.get("start") == start) && ((eAnimation && eAnimation.playing && eAnimation.to == end) || this.get("end") == end)) {
                return;
            }
            if (duration > 0) {
                let easing = this.get("interpolationEasing");
                let sAnimation, eAnimation;
                if (this.get("start") != start) {
                    sAnimation = this.animate({ key: "start", to: start, duration: duration, easing: easing });
                }
                if (this.get("end") != end) {
                    eAnimation = this.animate({ key: "end", to: end, duration: duration, easing: easing });
                }
                this._sAnimation = sAnimation;
                this._eAnimation = eAnimation;
                if (sAnimation) {
                    return sAnimation;
                }
                else if (eAnimation) {
                    return eAnimation;
                }
            }
            else {
                this.set("start", start);
                this.set("end", end);
                // otherwise bullets and line out of sync, as series is not redrawn
                this._root.events.once("frameended", () => {
                    this._markDirtyKey("start");
                    this._root._markDirty();
                });
            }
        }
        else {
            if (this._sAnimation) {
                this._sAnimation.stop();
            }
            if (this._eAnimation) {
                this._eAnimation.stop();
            }
        }
    }
    /**
     * A list of series using this axis.
     *
     * @return Series
     */
    get series() {
        return this._series;
    }
    _processAxisRange(dataItem, themeTags) {
        dataItem.setRaw("isRange", true);
        this._createAssets(dataItem, themeTags);
        this._rangesDirty = true;
        this._prepareDataItem(dataItem);
        const above = dataItem.get("above");
        const container = this.topGridContainer;
        const grid = dataItem.get("grid");
        if (above && grid) {
            container.children.moveValue(grid);
        }
        const fill = dataItem.get("axisFill");
        if (above && fill) {
            container.children.moveValue(fill);
        }
    }
    _prepareDataItem(_dataItem, _index) { }
    /**
     * @ignore
     */
    markDirtyExtremes() {
    }
    /**
     * @ignore
     */
    markDirtySelectionExtremes() {
    }
    _calculateTotals() {
    }
    _updateAxisRanges() {
        this._bullets = {};
        this.axisRanges.each((axisRange) => {
            this._prepareDataItem(axisRange);
        });
        $array.each(this._seriesAxisRanges, (axisRange) => {
            this._prepareDataItem(axisRange);
        });
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this.get("fixAxisSize")) {
            this.ghostLabel.set("visible", true);
        }
        else {
            this.ghostLabel.set("visible", false);
        }
        if (this.isDirty("start") || this.isDirty("end")) {
            const chart = this.chart;
            if (chart) {
                chart._updateCursor();
            }
            let start = this.get("start", 0);
            let end = this.get("end", 1);
            let maxDeviation = this.get("maxDeviation", 0.5) * Math.min(1, (end - start));
            if (start < -maxDeviation) {
                let delta = start + maxDeviation;
                start = -maxDeviation;
                this.setRaw("start", start);
                if (this.isDirty("end")) {
                    this.setRaw("end", end - delta);
                }
            }
            if (end > 1 + maxDeviation) {
                let delta = end - 1 - maxDeviation;
                end = 1 + maxDeviation;
                this.setRaw("end", end);
                if (this.isDirty("start")) {
                    this.setRaw("start", start - delta);
                }
            }
        }
        const renderer = this.get("renderer");
        renderer._start = this.get("start");
        renderer._end = this.get("end");
        renderer._inversed = renderer.get("inversed", false);
        renderer._axisLength = renderer.axisLength() / (renderer._end - renderer._start);
        renderer._updateLC();
        if (this.isDirty("tooltip")) {
            const tooltip = this.get("tooltip");
            if (tooltip) {
                const rendererTags = renderer.get("themeTags");
                tooltip.addTag("axis");
                tooltip.addTag(this.className.toLowerCase());
                tooltip._applyThemes();
                if (rendererTags) {
                    tooltip.set("themeTags", $utils.mergeTags(tooltip.get("themeTags"), rendererTags));
                    tooltip.label._applyThemes();
                }
            }
        }
    }
    _updateTooltipBounds() {
        const tooltip = this.get("tooltip");
        if (tooltip) {
            this.get("renderer").updateTooltipBounds(tooltip);
        }
    }
    _updateBounds() {
        super._updateBounds();
        this._updateTooltipBounds();
    }
    /**
     * @ignore
     */
    processChart(chart) {
        this.chart = chart;
        const renderer = this.get("renderer");
        renderer.chart = chart;
        chart.gridContainer.children.push(this.gridContainer);
        chart.topGridContainer.children.push(this.topGridContainer);
        chart.axisHeadersContainer.children.push(this.axisHeader);
        this.on("start", () => {
            chart._handleAxisSelection(this);
        });
        this.on("end", () => {
            chart._handleAxisSelection(this);
        });
        chart.plotContainer.onPrivate("width", () => {
            this.markDirtySize();
        });
        chart.plotContainer.onPrivate("height", () => {
            this.markDirtySize();
        });
        chart.processAxis(this);
    }
    /**
     * @ignore
     */
    hideDataItem(dataItem) {
        this._toggleFHDataItem(dataItem, true);
        return super.hideDataItem(dataItem);
    }
    /**
     * @ignore
     */
    showDataItem(dataItem) {
        this._toggleFHDataItem(dataItem, false);
        return super.showDataItem(dataItem);
    }
    _toggleFHDataItem(dataItem, forceHidden) {
        const fh = "forceHidden";
        const label = dataItem.get("label");
        if (label) {
            label.set(fh, forceHidden);
        }
        const grid = dataItem.get("grid");
        if (grid) {
            grid.set(fh, forceHidden);
        }
        const tick = dataItem.get("tick");
        if (tick) {
            tick.set(fh, forceHidden);
        }
        const axisFill = dataItem.get("axisFill");
        if (axisFill) {
            axisFill.set(fh, forceHidden);
        }
        const bullet = dataItem.get("bullet");
        if (bullet) {
            const sprite = bullet.get("sprite");
            if (sprite) {
                sprite.set(fh, forceHidden);
            }
        }
    }
    _toggleDataItem(dataItem, visible) {
        const label = dataItem.get("label");
        const v = "visible";
        if (label) {
            label.setPrivate(v, visible);
        }
        const grid = dataItem.get("grid");
        if (grid) {
            grid.setPrivate(v, visible);
        }
        const tick = dataItem.get("tick");
        if (tick) {
            tick.setPrivate(v, visible);
        }
        const axisFill = dataItem.get("axisFill");
        if (axisFill) {
            axisFill.setPrivate(v, visible);
        }
        const bullet = dataItem.get("bullet");
        if (bullet) {
            const sprite = bullet.get("sprite");
            if (sprite) {
                sprite.setPrivate(v, visible);
            }
        }
    }
    _createAssets(dataItem, tags, minor) {
        var _a, _b, _c;
        const renderer = this.get("renderer");
        let m = "minor";
        const label = dataItem.get("label");
        if (!label) {
            renderer.makeLabel(dataItem, tags);
        }
        else {
            let themeTags = label.get("themeTags");
            let remove = false;
            if (minor) {
                if ((themeTags === null || themeTags === void 0 ? void 0 : themeTags.indexOf(m)) == -1) {
                    remove = true;
                }
            }
            else {
                if ((themeTags === null || themeTags === void 0 ? void 0 : themeTags.indexOf(m)) != -1) {
                    remove = true;
                }
            }
            if (remove) {
                (_a = label.parent) === null || _a === void 0 ? void 0 : _a.children.removeValue(label);
                renderer.makeLabel(dataItem, tags);
                label.dispose();
                renderer.labels.removeValue(label);
            }
        }
        const grid = dataItem.get("grid");
        if (!grid) {
            renderer.makeGrid(dataItem, tags);
        }
        else {
            let themeTags = grid.get("themeTags");
            let remove = false;
            if (minor) {
                if ((themeTags === null || themeTags === void 0 ? void 0 : themeTags.indexOf(m)) == -1) {
                    remove = true;
                }
            }
            else {
                if ((themeTags === null || themeTags === void 0 ? void 0 : themeTags.indexOf(m)) != -1) {
                    remove = true;
                }
            }
            if (remove) {
                (_b = grid.parent) === null || _b === void 0 ? void 0 : _b.children.removeValue(grid);
                renderer.makeGrid(dataItem, tags);
                grid.dispose();
                renderer.grid.removeValue(grid);
            }
        }
        const tick = dataItem.get("tick");
        if (!tick) {
            renderer.makeTick(dataItem, tags);
        }
        else {
            let remove = false;
            let themeTags = tick.get("themeTags");
            if (minor) {
                if ((themeTags === null || themeTags === void 0 ? void 0 : themeTags.indexOf(m)) == -1) {
                    remove = true;
                }
            }
            else {
                if ((themeTags === null || themeTags === void 0 ? void 0 : themeTags.indexOf(m)) != -1) {
                    remove = true;
                }
            }
            if (remove) {
                (_c = tick.parent) === null || _c === void 0 ? void 0 : _c.children.removeValue(tick);
                renderer.makeTick(dataItem, tags);
                tick.dispose();
                renderer.ticks.removeValue(tick);
            }
        }
        if (!minor && !dataItem.get("axisFill")) {
            renderer.makeAxisFill(dataItem, tags);
        }
        this._processBullet(dataItem);
    }
    _processBullet(dataItem) {
        let bullet = dataItem.get("bullet");
        let axisBullet = this.get("bullet");
        if (!bullet && axisBullet && !dataItem.get("isRange")) {
            bullet = axisBullet(this._root, this, dataItem);
        }
        if (bullet) {
            bullet.axis = this;
            const sprite = bullet.get("sprite");
            if (sprite) {
                sprite._setDataItem(dataItem);
                dataItem.setRaw("bullet", bullet);
                if (!sprite.parent) {
                    this.bulletsContainer.children.push(sprite);
                }
            }
        }
    }
    _afterChanged() {
        super._afterChanged();
        const chart = this.chart;
        if (chart) {
            chart._updateChartLayout();
            chart.axisHeadersContainer.markDirtySize();
        }
        this.get("renderer")._updatePositions();
    }
    /**
     * @ignore
     */
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        const renderer = this.get("renderer");
        const label = dataItem.get("label");
        if (label) {
            renderer.labels.removeValue(label);
            label.dispose();
        }
        const tick = dataItem.get("tick");
        if (tick) {
            renderer.ticks.removeValue(tick);
            tick.dispose();
        }
        const grid = dataItem.get("grid");
        if (grid) {
            renderer.grid.removeValue(grid);
            grid.dispose();
        }
        const axisFill = dataItem.get("axisFill");
        if (axisFill) {
            renderer.axisFills.removeValue(axisFill);
            axisFill.dispose();
        }
        const bullet = dataItem.get("bullet");
        if (bullet) {
            bullet.dispose();
        }
    }
    _updateGhost() {
        this.setPrivate("cellWidth", this.getCellWidthPosition() * this.get("renderer").axisLength());
        const ghostLabel = this.ghostLabel;
        if (!ghostLabel.isHidden()) {
            const bounds = ghostLabel.localBounds();
            const gWidth = Math.ceil(bounds.right - bounds.left);
            let text = ghostLabel.get("text");
            $array.each(this.dataItems, (dataItem) => {
                const label = dataItem.get("label");
                if (label && !label.isHidden()) {
                    const bounds = label.localBounds();
                    const w = Math.ceil(bounds.right - bounds.left);
                    if (w > gWidth) {
                        text = label.text._getText();
                    }
                }
            });
            ghostLabel.set("text", text);
        }
        let start = this.get("start", 0);
        let end = this.get("end", 1);
        this.get("renderer").updateLabel(ghostLabel, start + (end - start) * 0.5);
    }
    _handleCursorPosition(position, snapToSeries) {
        const renderer = this.get("renderer");
        position = renderer.toAxisPosition(position);
        this._cursorPosition = position;
        this._snapToSeries = snapToSeries;
        this.updateTooltip();
    }
    /**
     * Can be called when axis zoom changes and you need to update tooltip
     * position.
     */
    updateTooltip() {
        const snapToSeries = this._snapToSeries;
        let position = this._cursorPosition;
        const tooltip = this.get("tooltip");
        const renderer = this.get("renderer");
        if ($type.isNumber(position)) {
            $array.each(this.series, (series) => {
                if (series.get("baseAxis") === this) {
                    const dataItem = this.getSeriesItem(series, position, this.get("tooltipLocation"));
                    series.setRaw("tooltipDataItem", dataItem);
                    if (snapToSeries && snapToSeries.indexOf(series) != -1) {
                        series.updateLegendMarker(dataItem);
                        series.updateLegendValue(dataItem);
                    }
                    else {
                        series.showDataItemTooltip(dataItem);
                    }
                }
            });
            if (tooltip) {
                renderer.updateTooltipBounds(tooltip);
                if (this.get("snapTooltip")) {
                    position = this.roundAxisPosition(position, this.get("tooltipLocation", 0.5));
                }
                if (!$type.isNaN(position)) {
                    this.setPrivateRaw("tooltipPosition", position);
                    this._updateTooltipText(tooltip, position);
                    renderer.positionTooltip(tooltip, position);
                    if (position < this.get("start") || position > this.get("end")) {
                        tooltip.hide(0);
                    }
                    else {
                        tooltip.show(0);
                    }
                }
                else {
                    tooltip.hide(0);
                }
            }
        }
    }
    _updateTooltipText(tooltip, position) {
        tooltip.label.set("text", this.getTooltipText(position));
    }
    /**
     * @ignore
     */
    roundAxisPosition(position, _location) {
        return position;
    }
    /**
     * @ignore
     */
    handleCursorShow() {
        let tooltip = this.get("tooltip");
        if (tooltip) {
            tooltip.show();
        }
    }
    /**
     * @ignore
     */
    handleCursorHide() {
        let tooltip = this.get("tooltip");
        if (tooltip) {
            tooltip.hide();
        }
    }
    /**
     * @ignore
     */
    processSeriesDataItem(_dataItem, _fields) {
    }
    _clearDirty() {
        super._clearDirty();
        this._sizeDirty = false;
        this._rangesDirty = false;
    }
    /**
     * Converts pixel coordinate to a relative position on axis.
     *
     * @param   coordinate  Coordinate
     * @return              Relative position
     */
    coordinateToPosition(coordinate) {
        const renderer = this.get("renderer");
        return renderer.toAxisPosition(coordinate / renderer.axisLength());
    }
    /**
     * Converts relative position of the plot area to relative position of the
     * axis with zoom taken into account.
     *
     * @param position Position
     * @return Relative position
     */
    toAxisPosition(position) {
        return this.get("renderer").toAxisPosition(position);
    }
    /**
     * Converts relative position of the axis to a global position taking current
     * zoom into account (opposite to what `toAxisPosition` does).
     *
     * @since 5.4.2
     * @param position Position
     * @return Global position
     */
    toGlobalPosition(position) {
        return this.get("renderer").toGlobalPosition(position);
    }
    /**
     * Adjusts position with inversed taken into account.
     *
     * @ignore
     */
    fixPosition(position) {
        return this.get("renderer").fixPosition(position);
    }
    /**
     * @ignore
     */
    shouldGap(_dataItem, _nextItem, _autoGapCount, _fieldName) {
        return false;
    }
    /**
     * Creates and returns an axis range object.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-ranges/} for more info
     * @param   axisDataItem  Axis data item
     * @return                Axis range
     */
    createAxisRange(axisDataItem) {
        return this.axisRanges.push(axisDataItem);
    }
    /**
     * @ignore
     */
    _groupSeriesData(_series) { }
    /**
     * Returns relative position between two grid lines of the axis.
     *
     * @return Position
     */
    getCellWidthPosition() {
        return 0.05;
    }
}
Object.defineProperty(Axis, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Axis"
});
Object.defineProperty(Axis, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Component.classNames.concat([Axis.className])
});
//# sourceMappingURL=Axis.js.map