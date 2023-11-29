import { MultiDisposer } from "../../core/util/Disposer";
import { PanelControls } from "./PanelControls";
import { StockChartDefaultTheme } from "./StockChartDefaultTheme";
import { XYChartDefaultTheme } from "../xy/XYChartDefaultTheme";
import { Container } from "../../core/render/Container";
import { ListAutoDispose } from "../../core/util/List";
import { Rectangle } from "../../core/render/Rectangle";
import { p100, percent } from "../../core/util/Percent";
import { SettingsModal } from "./SettingsModal";
import { Color } from "../../core/util/Color";
import { registry } from "../../core/Registry";
import * as $array from "../../core/util/Array";
import * as $utils from "../../core/util/Utils";
import * as $object from "../../core/util/Object";
/**
 * A main class for the Stock Chart.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/} for more info
 * @important
 */
export class StockChart extends Container {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_xAxes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_downY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_upperPanel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_dhp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_uhp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_downResizer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_syncExtremesDp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_drawingsChanged", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_indicatorsChanged", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * A list of stock panels.
         *
         * @see {@link https://www.amcharts.com/docs/v5/charts/stock/#Panels} for more info
         */
        Object.defineProperty(this, "panels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListAutoDispose()
        });
        /**
         * A list of indicators on chart.
         *
         * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
         */
        Object.defineProperty(this, "indicators", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListAutoDispose()
        });
        /**
         * A [[Container]], resiting on top of the charts, suitable for additional
         * tools, like [[Scrollbar]].
         *
         * @default Container.new()
         */
        Object.defineProperty(this, "toolsContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Container.new(this._root, { width: p100, themeTags: [] }))
        });
        /**
         * A [[Container]] where all the stock panels are placed into.
         *
         * @default Container.new()
         */
        Object.defineProperty(this, "panelsContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Container.new(this._root, { width: p100, height: p100, layout: this._root.verticalLayout, themeTags: ["chartscontainer"] }))
        });
    }
    _afterNew() {
        this._settings.themeTags = $utils.mergeTags(this._settings.themeTags, ["stock"]);
        this._defaultThemes.push(StockChartDefaultTheme.new(this._root));
        this._defaultThemes.push(XYChartDefaultTheme.new(this._root));
        const tooltipContainer = this._root.tooltipContainer;
        tooltipContainer.set("themeTags", $utils.mergeTags(tooltipContainer.get("themeTags", []), ["stock"]));
        super._afterNew();
        const children = this.panelsContainer.children;
        this._disposers.push(this.panels.events.onAll((change) => {
            if (change.type === "clear") {
                $array.each(change.oldValues, (chart) => {
                    this._removePanel(chart);
                });
            }
            else if (change.type === "push") {
                children.moveValue(change.newValue);
                this._processPanel(change.newValue);
            }
            else if (change.type === "setIndex") {
                children.setIndex(change.index, change.newValue);
                this._processPanel(change.newValue);
            }
            else if (change.type === "insertIndex") {
                children.insertIndex(change.index, change.newValue);
                this._processPanel(change.newValue);
            }
            else if (change.type === "removeIndex") {
                this._removePanel(change.oldValue);
            }
            else {
                throw new Error("Unknown IListEvent type");
            }
        }));
        this._disposers.push(this.indicators.events.onAll((change) => {
            if (change.type === "clear") {
                $array.each(change.oldValues, (indicator) => {
                    this._removeIndicator(indicator);
                });
            }
            else if (change.type === "push") {
                this._processIndicator(change.newValue);
            }
            else if (change.type === "setIndex") {
                this._processIndicator(change.newValue);
            }
            else if (change.type === "insertIndex") {
                this._processIndicator(change.newValue);
            }
            else if (change.type === "removeIndex") {
                this._removeIndicator(change.oldValue);
            }
            else {
                throw new Error("Unknown IListEvent type");
            }
        }));
        this.setPrivateRaw("settingsModal", SettingsModal.new(this.root, {
            stockChart: this
        }));
        let license = false;
        for (let i = 0; i < registry.licenses.length; i++) {
            if (registry.licenses[i].match(/^AM5S.{5,}/i)) {
                license = true;
            }
        }
        if (!license) {
            this._root._showBranding();
        }
        else {
            this._root._licenseApplied();
        }
    }
    dispose() {
        super.dispose();
        const settingsModal = this.getPrivate("settingsModal");
        if (settingsModal) {
            settingsModal.dispose();
        }
    }
    /**
     * Forces redrawing of all annotations (drfawings).
     */
    markDirtyDrawings() {
        this._drawingsChanged = true;
        this.markDirty();
    }
    /**
     * Forces redrawing of Indicators.
     */
    markDirtyIndicators() {
        this._indicatorsChanged = true;
        this.markDirty();
    }
    /**
     * Enables or disables interactivity of annotations (drawings).
     *
     * @param value Drawings interactive?
     * @since 5.4.9
     */
    drawingsInteractive(value) {
        this.panels.each((panel) => {
            panel.series.each((series) => {
                if (series.isType("DrawingSeries")) {
                    series.setInteractive(value);
                }
            });
        });
    }
    _prepareChildren() {
        if (this.isDirty("volumeNegativeColor") || this.isDirty("volumePositiveColor")) {
            const volumeSeries = this.get("volumeSeries");
            if (volumeSeries && volumeSeries.isType("BaseColumnSeries")) {
                volumeSeries.columns.each((column) => {
                    column._markDirtyKey("fill");
                });
            }
        }
        const stockSeries = this.get("stockSeries");
        if (this.isDirty("stockSeries")) {
            if (stockSeries) {
                const previous = this._prevSettings.stockSeries;
                this.indicators.each((indicator) => {
                    if (previous == indicator.get("stockSeries")) {
                        indicator.set("stockSeries", stockSeries);
                    }
                    else {
                        indicator._setSoft("stockSeries", stockSeries);
                    }
                });
                const mainChart = stockSeries.chart;
                if (mainChart) {
                    mainChart.series.each((series) => {
                        if (series.isType("DrawingSeries")) {
                            let s = series.get("series");
                            if (s == previous) {
                                series.set("series", stockSeries);
                            }
                            else {
                                series._setSoft("series", stockSeries);
                            }
                        }
                    });
                    const xAxis = mainChart.xAxes.getIndex(0);
                    if (xAxis) {
                        if (this._syncExtremesDp) {
                            this._syncExtremesDp.dispose();
                        }
                        this.setPrivateRaw("mainAxis", xAxis);
                        this._syncExtremesDp = new MultiDisposer([
                            xAxis.onPrivate("max", () => {
                                this._syncExtremes();
                            }),
                            xAxis.onPrivate("min", () => {
                                this._syncExtremes();
                            })
                        ]);
                    }
                }
                if (this.getPrivate("comparing")) {
                    this.setPercentScale(true);
                }
            }
        }
        super._prepareChildren();
    }
    _afterChanged() {
        super._afterChanged();
        if (this._drawingsChanged) {
            this._drawingsChanged = false;
            const type = "drawingsupdated";
            if (this.events.isEnabled(type)) {
                this.events.dispatch(type, { type: type, target: this });
            }
        }
        if (this._indicatorsChanged) {
            this._indicatorsChanged = false;
            const type = "indicatorsupdated";
            if (this.events.isEnabled(type)) {
                this.events.dispatch(type, { type: type, target: this });
            }
        }
    }
    _updateChildren() {
        super._updateChildren();
        const stockSeries = this.get("stockSeries");
        if (this.isDirty("volumeSeries")) {
            const volumeSeries = this.get("volumeSeries");
            if (volumeSeries) {
                const volumePanel = volumeSeries.chart;
                if (volumePanel) {
                    volumePanel.series.events.on("removeIndex", (event) => {
                        if (event.oldValue == volumeSeries) {
                            this.set("volumeSeries", undefined);
                        }
                    });
                }
            }
        }
        if (this.isDirty("stockNegativeColor") || this.isDirty("stockPositiveColor") || this.isDirty("stockSeries")) {
            if (stockSeries && stockSeries.isType("BaseColumnSeries")) {
                const stockNegativeColor = this.get("stockNegativeColor", this._root.interfaceColors.get("negative"));
                const stockPositiveColor = this.get("stockPositiveColor", this._root.interfaceColors.get("positive"));
                let previous = stockSeries.dataItems[0];
                if (stockPositiveColor && stockPositiveColor) {
                    $array.each(stockSeries.dataItems, (dataItem) => {
                        const column = dataItem.get("graphics");
                        if (column) {
                            const dropFromOpen = column.states.lookup("dropFromOpen");
                            if (dropFromOpen) {
                                dropFromOpen.setAll({ fill: stockNegativeColor, stroke: stockNegativeColor });
                            }
                            const riseFromOpen = column.states.lookup("riseFromOpen");
                            if (riseFromOpen) {
                                riseFromOpen.setAll({ fill: stockPositiveColor, stroke: stockPositiveColor });
                            }
                            const dropFromPrevious = column.states.lookup("dropFromPrevious");
                            if (dropFromPrevious) {
                                dropFromPrevious.setAll({ fill: stockNegativeColor, stroke: stockNegativeColor });
                            }
                            const riseFromPrevious = column.states.lookup("riseFromPrevious");
                            if (riseFromPrevious) {
                                riseFromPrevious.setAll({ fill: stockPositiveColor, stroke: stockPositiveColor });
                            }
                            stockSeries._applyGraphicsStates(dataItem, previous);
                            previous = dataItem;
                        }
                    });
                    const states = stockSeries.columns.template.states;
                    const riseFromOpen = states.lookup("riseFromOpen");
                    const themeTags = stockSeries.columns.template.get("themeTags");
                    if (stockPositiveColor) {
                        if (riseFromOpen) {
                            riseFromOpen.setAll({ fill: stockPositiveColor, stroke: stockPositiveColor });
                        }
                        else {
                            states.create("riseFromOpen", { fill: stockPositiveColor, stroke: stockPositiveColor });
                        }
                        const riseFromPrevious = states.lookup("riseFromPrevious");
                        if (riseFromPrevious) {
                            riseFromPrevious.setAll({ fill: stockPositiveColor, stroke: stockPositiveColor });
                        }
                        else {
                            if (themeTags && themeTags.indexOf("pro") != -1) {
                                states.create("riseFromPrevious", { fill: stockPositiveColor, stroke: stockPositiveColor });
                            }
                        }
                    }
                    if (stockNegativeColor) {
                        const dropFromOpen = states.lookup("dropFromOpen");
                        if (dropFromOpen) {
                            dropFromOpen.setAll({ fill: stockNegativeColor, stroke: stockNegativeColor });
                        }
                        else {
                            states.create("dropFromOpen", { fill: stockNegativeColor, stroke: stockNegativeColor });
                        }
                        const dropFromPrevious = states.lookup("dropFromPrevious");
                        if (dropFromPrevious) {
                            dropFromPrevious.setAll({ fill: stockNegativeColor, stroke: stockNegativeColor });
                        }
                        else {
                            if (themeTags && themeTags.indexOf("pro") != -1) {
                                states.create("dropFromPrevious", { fill: stockNegativeColor, stroke: stockNegativeColor });
                            }
                        }
                    }
                }
                stockSeries.markDirtyValues();
            }
        }
    }
    /**
     * Enables or disables percent scale mode.
     *
     * If `percentScale` is not set, it will try to determine the status on its own.
     *
     * In percent scale mode `percentScaleSeriesSettings` and `percentScaleValueAxisSettings` will
     * be applied to the regular series on the main panel and its Y axis.
     *
     * @param  percentScale  Comparison mode active
     */
    setPercentScale(percentScale) {
        const stockSeries = this.get("stockSeries");
        const seriesSettings = this.get("percentScaleSeriesSettings");
        const axisSettings = this.get("percentScaleValueAxisSettings");
        if (stockSeries) {
            const mainChart = stockSeries.chart;
            const yAxis = stockSeries.get("yAxis");
            yAxis.set("logarithmic", false);
            this._maybePrepAxisDefaults();
            if (mainChart) {
                const seriesList = [];
                mainChart.series.each((series) => {
                    if (series.get("yAxis") == yAxis) {
                        seriesList.push(series);
                        this._maybePrepSeriesDefaults(series);
                    }
                });
                if (percentScale == undefined) {
                    percentScale = this.getPrivate("comparedSeries", []).length > 0;
                }
                this.setPrivate("comparing", percentScale);
                if (seriesSettings) {
                    $array.each(seriesList, (series) => {
                        if (percentScale) {
                            series.setAll(seriesSettings);
                            series.states.lookup("default").setAll(seriesSettings);
                        }
                        else {
                            series.states.apply("comparingDefaults");
                            const seriesDefaults = series.states.lookup("comparingDefaults");
                            if (seriesDefaults) {
                                series.states.lookup("default").setAll(seriesDefaults._settings);
                            }
                        }
                    });
                }
                if (axisSettings) {
                    if (percentScale) {
                        yAxis.setAll(axisSettings);
                    }
                    else {
                        yAxis.states.apply("comparingDefaults");
                    }
                }
            }
        }
    }
    /**
     * Adds a "compared" series to chart. Returns the same series.
     *
     * @param   series  Compared series
     * @return          Compared series
     */
    addComparingSeries(series) {
        const stockSeries = this.get("stockSeries");
        if (stockSeries) {
            const chart = stockSeries.chart;
            if (chart) {
                chart.series.push(series);
            }
            // Apply comparingSeriesSettings
            const comparingSeriesSettings = this.get("comparingSeriesSettings");
            if (comparingSeriesSettings) {
                series.setAll(comparingSeriesSettings);
            }
            const comparedSeries = this.getPrivate("comparedSeries");
            if (comparedSeries) {
                comparedSeries.push(series);
            }
            else {
                this.setPrivate("comparedSeries", [series]);
            }
            const legendDataItem = stockSeries.get("legendDataItem");
            if (legendDataItem) {
                const legend = legendDataItem.component;
                if (legend.isType("StockLegend")) {
                    legend.data.push(series);
                    const ldi = series.get("legendDataItem");
                    if (ldi) {
                        const closeButton = ldi.get("closeButton");
                        closeButton.set("forceHidden", false);
                        closeButton.events.on("click", () => {
                            this.removeComparingSeries(series);
                        });
                    }
                }
            }
            if (this.get("autoSetPercentScale")) {
                this.setPercentScale(true);
            }
        }
        return series;
    }
    /**
     * Removes compared series.
     *
     * @param  series  Compared series
     */
    removeComparingSeries(series) {
        const stockSeries = this.get("stockSeries");
        if (stockSeries) {
            const chart = stockSeries.chart;
            if (chart) {
                chart.series.removeValue(series);
            }
            const comparedSeries = this.getPrivate("comparedSeries");
            if (comparedSeries) {
                $array.remove(comparedSeries, series);
                if (comparedSeries.length == 0 && this.get("autoSetPercentScale")) {
                    this.setPercentScale(false);
                }
            }
        }
        const ldi = series.get("legendDataItem");
        if (ldi) {
            const legend = ldi.component;
            legend.data.removeValue(series);
        }
    }
    _maybePrepSeriesDefaults(series) {
        if (!series.states.lookup("comparingDefaults")) {
            const seriesSettings = this.get("percentScaleSeriesSettings");
            const defaults = {};
            $object.each(seriesSettings, (key, _val) => {
                defaults[key] = series.get(key);
            });
            series.states.create("comparingDefaults", defaults);
        }
    }
    _maybePrepAxisDefaults() {
        const stockSeries = this.get("stockSeries");
        const axis = stockSeries.get("yAxis");
        if (!axis.states.lookup("comparingDefaults")) {
            const axisSettings = this.get("percentScaleValueAxisSettings");
            const defaults = {};
            $object.each(axisSettings, (key, _val) => {
                defaults[key] = axis.get(key);
            });
            axis.states.create("comparingDefaults", defaults);
        }
    }
    _processIndicator(indicator) {
        this.children.push(indicator);
        const stockSeries = this.get("stockSeries");
        if (stockSeries) {
            indicator._setSoft("stockSeries", stockSeries);
        }
        const volumeSeries = this.get("volumeSeries");
        if (volumeSeries) {
            indicator._setSoft("volumeSeries", volumeSeries);
        }
        if (this.getPrivate("comparing")) {
            this.setPercentScale(true);
        }
        $array.each(indicator._editableSettings, (setting) => {
            indicator.on(setting.key, () => {
                this.markDirtyIndicators();
            });
        });
        this.markDirtyIndicators();
        indicator.prepareData();
    }
    _removeIndicator(indicator) {
        this.children.removeValue(indicator);
        this.markDirtyIndicators();
    }
    _removePanel(chart) {
        this.panelsContainer.children.removeValue(chart);
    }
    _updateControls() {
        const stockSeries = this.get("stockSeries");
        this.panels.each((panel) => {
            const panelControls = panel.panelControls;
            const index = this.panelsContainer.children.indexOf(panel);
            const len = this.panels.length;
            panelControls.upButton.setPrivate("visible", false);
            panelControls.downButton.setPrivate("visible", false);
            panelControls.expandButton.setPrivate("visible", false);
            panelControls.closeButton.setPrivate("visible", false);
            if (len > 1) {
                panelControls.expandButton.setPrivate("visible", true);
                if (index != 0) {
                    panelControls.upButton.setPrivate("visible", true);
                }
                if (index != len - 1) {
                    panelControls.downButton.setPrivate("visible", true);
                }
                if (!stockSeries || stockSeries.chart != panel) {
                    panelControls.closeButton.setPrivate("visible", true);
                }
            }
            if (stockSeries) {
                this.indicators.each((indicator) => {
                    indicator.set("stockSeries", stockSeries);
                });
            }
        });
    }
    _processPanel(panel) {
        panel.setPrivate("otherCharts", this.panels.values);
        panel.setPrivate("stockChart", this);
        panel.panelControls = panel.topPlotContainer.children.push(PanelControls.new(this._root, { stockPanel: panel, stockChart: this }));
        this._updateControls();
        if (this.panels.length > 1) {
            const resizer = panel.children.push(Rectangle.new(this._root, { themeTags: ["panelresizer"] }));
            panel.panelResizer = resizer;
            resizer.events.on("pointerdown", (e) => {
                const chartsContainer = this.panelsContainer;
                this._downResizer = e.target;
                this.panels.each((chart) => {
                    chart.set("height", percent(chart.height() / chartsContainer.height() * 100));
                });
                this._downY = chartsContainer.toLocal(e.point).y;
                const upperChart = this.panels.getIndex(this.panels.indexOf(panel) - 1);
                this._upperPanel = upperChart;
                if (upperChart) {
                    this._uhp = upperChart.get("height");
                }
                this._dhp = panel.get("height");
            });
            resizer.events.on("pointerup", () => {
                this._downResizer = undefined;
            });
            resizer.events.on("globalpointermove", (e) => {
                if (e.target == this._downResizer) {
                    const chartsContainer = this.panelsContainer;
                    const height = chartsContainer.height();
                    const upperChart = this._upperPanel;
                    if (upperChart) {
                        const index = this.panels.indexOf(upperChart) + 2;
                        let max = height - panel.get("minHeight", 0);
                        const lowerChart = this.panels.getIndex(index);
                        if (lowerChart) {
                            max = lowerChart.y() - panel.get("minHeight", 0);
                        }
                        //console.log(upperChart.get("minHeight", 0))
                        const y = Math.max(upperChart.y() + upperChart.get("minHeight", 0) + upperChart.get("paddingTop", 0), Math.min(chartsContainer.toLocal(e.point).y, max));
                        const downY = this._downY;
                        const dhp = this._dhp;
                        const uhp = this._uhp;
                        if (downY != null && dhp != null && uhp != null) {
                            const diff = (downY - y) / height;
                            panel.set("height", percent((dhp.value + diff) * 100));
                            upperChart.set("height", percent((uhp.value - diff) * 100));
                        }
                    }
                }
            });
        }
        panel.xAxes.events.onAll((change) => {
            if (change.type === "clear") {
                $array.each(change.oldValues, (axis) => {
                    this._removeXAxis(axis);
                });
            }
            else if (change.type === "push") {
                this._processXAxis(change.newValue);
            }
            else if (change.type === "setIndex") {
                this._processXAxis(change.newValue);
            }
            else if (change.type === "insertIndex") {
                this._processXAxis(change.newValue);
            }
            else if (change.type === "removeIndex") {
                this._removeXAxis(change.oldValue);
            }
            else {
                throw new Error("Unknown IListEvent type");
            }
        });
        panel.leftAxesContainer.events.on("boundschanged", () => {
            this._syncYAxesSize();
        });
        panel.rightAxesContainer.events.on("boundschanged", () => {
            this._syncYAxesSize();
        });
    }
    _syncYAxesSize() {
        let maxLeft = 0;
        let maxRight = 0;
        this.panels.each((chart) => {
            let lw = chart.leftAxesContainer.width();
            let rw = chart.rightAxesContainer.width();
            if (lw > maxLeft) {
                maxLeft = lw;
            }
            if (rw > maxRight) {
                maxRight = rw;
            }
        });
        this.panels.each((chart) => {
            chart.leftAxesContainer.set("minWidth", maxLeft);
            chart.rightAxesContainer.set("minWidth", maxRight);
        });
        this.toolsContainer.set("paddingRight", maxRight);
        this.toolsContainer.set("paddingRight", maxRight);
    }
    _removeXAxis(_axis) {
    }
    _processXAxis(axis) {
        $array.move(this._xAxes, axis);
        axis.on("start", () => {
            if (axis._skipSync != true) {
                this._syncXAxes(axis);
            }
        });
        axis.on("end", () => {
            if (axis._skipSync != true) {
                this._syncXAxes(axis);
            }
        });
    }
    _syncExtremes() {
        const mainAxis = this.getPrivate("mainAxis");
        if (mainAxis) {
            const min = mainAxis.getPrivate("min");
            const max = mainAxis.getPrivate("max");
            this.panels.each((panel) => {
                panel.xAxes.each((xAxis) => {
                    if (xAxis != mainAxis) {
                        let axisMin = xAxis.getPrivate("min");
                        let axisMax = xAxis.getPrivate("max");
                        if (axisMin != min) {
                            xAxis.set("min", min);
                        }
                        if (axisMax != max) {
                            xAxis.set("max", max);
                        }
                    }
                });
            });
        }
    }
    _syncXAxes(axis) {
        $array.each(this._xAxes, (xAxis) => {
            if (xAxis != axis) {
                xAxis._skipSync = true;
                xAxis.set("start", axis.get("start"));
                xAxis.set("end", axis.get("end"));
                xAxis._skipSync = false;
            }
        });
    }
    /**
     * Returns a color for volume, based on current and previous close.
     *
     * * `positiveColor` - close is greater or euqal than close of the previous period.
     * * `negativeColor` - close is lower than close of the previous period.
     *
     * @param   dataItem       Target data item
     * @param   negativeColor  "Negative color" (red)
     * @param   positiveColor  "Positive color" (green)
     * @return  Color
     */
    getVolumeColor(dataItem, negativeColor, positiveColor) {
        if (dataItem) {
            const stockSeries = this.get("stockSeries");
            const volumeSeries = dataItem.component;
            if (!negativeColor) {
                negativeColor = this.get("volumeNegativeColor", this.root.interfaceColors.get("negative", Color.fromHex(0xff0000)));
            }
            if (!positiveColor) {
                positiveColor = this.get("volumePositiveColor", this.root.interfaceColors.get("positive", Color.fromHex(0x00FF00)));
            }
            if (negativeColor && positiveColor) {
                if (stockSeries && volumeSeries) {
                    const index = volumeSeries.dataItems.indexOf(dataItem);
                    if (index > 0) {
                        let stockDataItem = stockSeries.dataItems[index];
                        if (stockDataItem) {
                            let close = stockDataItem.get("valueY");
                            if (close != null) {
                                for (let i = index - 1; i >= 0; i--) {
                                    let di = stockSeries.dataItems[i];
                                    let previousClose = di.get("valueY");
                                    if (previousClose != null) {
                                        if (close < previousClose) {
                                            return negativeColor;
                                        }
                                        else {
                                            return positiveColor;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return positiveColor;
    }
}
Object.defineProperty(StockChart, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "StockChart"
});
Object.defineProperty(StockChart, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Container.classNames.concat([StockChart.className])
});
//# sourceMappingURL=StockChart.js.map