import { color } from "../../../core/util/Color";
import { Template } from "../../../core/util/Template";
import { StockControl } from "./StockControl";
import { DrawingToolControl } from "./DrawingToolControl";
import { ColorControl } from "./ColorControl";
import { DropdownListControl } from "./DropdownListControl";
import { IconControl } from "./IconControl";
import { StockIcons } from "./StockIcons";
import { DrawingSeries } from "../drawing/DrawingSeries";
import { AverageSeries } from "../drawing/AverageSeries";
import { CalloutSeries } from "../drawing/CalloutSeries";
import { EllipseSeries } from "../drawing/EllipseSeries";
import { DoodleSeries } from "../drawing/DoodleSeries";
import { FibonacciSeries } from "../drawing/FibonacciSeries";
import { FibonacciTimezoneSeries } from "../drawing/FibonacciTimezoneSeries";
import { HorizontalLineSeries } from "../drawing/HorizontalLineSeries";
import { HorizontalRaySeries } from "../drawing/HorizontalRaySeries";
import { IconSeries } from "../drawing/IconSeries";
import { LabelSeries } from "../drawing/LabelSeries";
import { SimpleLineSeries } from "../drawing/SimpleLineSeries";
import { PolylineSeries } from "../drawing/PolylineSeries";
import { QuadrantLineSeries } from "../drawing/QuadrantLineSeries";
import { RectangleSeries } from "../drawing/RectangleSeries";
import { ParallelChannelSeries } from "../drawing/ParallelChannelSeries";
import { RegressionSeries } from "../drawing/RegressionSeries";
import { TrendLineSeries } from "../drawing/TrendLineSeries";
import { VerticalLineSeries } from "../drawing/VerticalLineSeries";
import { Measure } from "../drawing/Measure";
import { JsonParser } from "../../../plugins/json/Json";
import { Serializer } from "../../../plugins/json/Serializer";
import * as $array from "../../../core/util/Array";
import * as $object from "../../../core/util/Object";
import * as $type from "../../../core/util/Type";
import * as $utils from "../../../core/util/Utils";
/**
 * A drawing tools control for [[StockChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/drawing-control/} for more info
 */
export class DrawingControl extends StockControl {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_drawingSeries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_currentEnabledSeries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_initedPanels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    _afterNew() {
        super._afterNew();
        // Init drawing toolbar
        if (this.getPrivate("toolbar")) {
            this._initToolbar();
        }
    }
    _initElements() {
        super._initElements();
    }
    _isInited() {
        return this.getPrivate("toolsContainer") ? true : false;
    }
    _resetControls() {
        this.getPrivate("eraserControl").set("active", false);
    }
    _initToolbar() {
        const stockChart = this.get("stockChart");
        const l = this._root.language;
        // Add additional container for drawing toolbar
        const toolbar = this.getPrivate("toolbar");
        const toolsContainer = document.createElement("div");
        toolsContainer.className = "am5stock-control-drawing-tools";
        toolsContainer.style.display = "none";
        this.setPrivate("toolsContainer", toolsContainer);
        toolbar.get("container").appendChild(toolsContainer);
        /**
         * Drawing tool selection control
         */
        const toolControl = DrawingToolControl.new(this._root, {
            stockChart: stockChart,
            description: l.translateAny("Drawing tool"),
            tools: this.get("tools")
        });
        toolsContainer.appendChild(toolControl.getPrivate("button"));
        this.setPrivate("toolControl", toolControl);
        toolControl.events.on("selected", (ev) => {
            eraserControl.set("active", false);
            this.set("tool", ev.tool);
        });
        toolControl.events.on("click", this._resetControls, this);
        /**
         * Icon selection control
         */
        const drawingIcons = this.get("drawingIcons");
        const iconControl = IconControl.new(this._root, {
            stockChart: stockChart,
            description: l.translateAny("Arrows &amp; Icons"),
            icons: drawingIcons
        });
        iconControl.setIcon(this.get("drawingIcon", drawingIcons[0]));
        toolsContainer.appendChild(iconControl.getPrivate("button"));
        this.setPrivate("iconControl", iconControl);
        iconControl.events.on("selected", (ev) => {
            this.set("drawingIcon", ev.icon);
        });
        iconControl.events.on("click", this._resetControls, this);
        /**
         * Snap toggle control
         */
        const snapControl = StockControl.new(this._root, {
            stockChart: stockChart,
            description: l.translateAny("Snap icon to data"),
            icon: StockIcons.getIcon("Snap")
        });
        snapControl.hide();
        toolsContainer.appendChild(snapControl.getPrivate("button"));
        this.setPrivate("snapControl", snapControl);
        if (this.get("snapToData")) {
            snapControl.set("active", true);
        }
        snapControl.on("active", (_ev) => {
            this.set("snapToData", snapControl.get("active") == true);
        });
        snapControl.events.on("click", this._resetControls, this);
        /**
         * Stroke color control
         */
        const strokeControl = ColorControl.new(this._root, {
            stockChart: stockChart,
            colors: this.get("colors"),
            description: l.translateAny("Line color")
        });
        strokeControl.hide();
        strokeControl.setPrivate("color", this.get("strokeColor", color(0x000000)));
        strokeControl.setPrivate("opacity", this.get("strokeOpacity", 1));
        toolsContainer.appendChild(strokeControl.getPrivate("button"));
        this.setPrivate("strokeControl", strokeControl);
        strokeControl.events.on("selected", (ev) => {
            this.set("strokeColor", ev.color);
        });
        strokeControl.events.on("selectedOpacity", (ev) => {
            this.set("strokeOpacity", ev.opacity);
        });
        strokeControl.events.on("click", this._resetControls, this);
        /**
         * Stroke width control
         */
        const strokeWidths = [];
        $array.each(this.get("strokeWidths", []), (width) => {
            strokeWidths.push(width + "px");
        });
        const strokeWidthControl = DropdownListControl.new(this._root, {
            stockChart: stockChart,
            description: l.translateAny("Line thickness"),
            currentItem: this.get("strokeWidth", "12") + "px",
            items: strokeWidths
        });
        strokeWidthControl.hide();
        //strokeWidthControl.setItem(this.get("strokeWidth", "12") + "px");
        strokeWidthControl.getPrivate("icon").style.display = "none";
        toolsContainer.appendChild(strokeWidthControl.getPrivate("button"));
        this.setPrivate("strokeWidthControl", strokeWidthControl);
        strokeWidthControl.events.on("selected", (ev) => {
            this.set("strokeWidth", $type.toNumber($type.isString(ev.item) ? ev.item : ev.item.id));
        });
        strokeWidthControl.events.on("click", this._resetControls, this);
        /**
         * Stroke dash cofiguration control
         */
        const strokeDasharrays = [];
        let currentStrokeDasharray;
        const strokeDasharray = this.get("strokeDasharray", []);
        $array.each(this.get("strokeDasharrays", []), (dasharray) => {
            const icon = StockIcons.getIcon("Dash");
            const id = JSON.stringify(dasharray);
            icon.setAttribute("stroke", "#000");
            icon.setAttribute("stroke-dasharray", dasharray.join(","));
            icon.setAttribute("class", "am5stock-icon-wide");
            strokeDasharrays.push({
                id: id,
                label: "",
                icon: icon
            });
            if (id == JSON.stringify(strokeDasharray)) {
                currentStrokeDasharray = StockIcons.getIcon("Dash");
                currentStrokeDasharray.setAttribute("stroke", "#000");
                currentStrokeDasharray.setAttribute("stroke-dasharray", dasharray.join(","));
                currentStrokeDasharray.setAttribute("class", "am5stock-icon-wide");
            }
        });
        const strokeDasharrayControl = DropdownListControl.new(this._root, {
            stockChart: stockChart,
            description: l.translateAny("Line style"),
            items: strokeDasharrays
        });
        strokeDasharrayControl.hide();
        if (currentStrokeDasharray) {
            strokeDasharrayControl.setItem({
                id: "",
                icon: currentStrokeDasharray,
                label: ""
            });
        }
        strokeDasharrayControl.getPrivate("icon").setAttribute("class", "am5stock-control-icon am5stock-icon-wide");
        toolsContainer.appendChild(strokeDasharrayControl.getPrivate("button"));
        this.setPrivate("strokeDasharrayControl", strokeDasharrayControl);
        strokeDasharrayControl.events.on("selected", (ev) => {
            this.set("strokeDasharray", JSON.parse(ev.item.id));
        });
        strokeDasharrayControl.events.on("click", this._resetControls, this);
        /**
         * Fill color control
         */
        const fillControl = ColorControl.new(this._root, {
            stockChart: stockChart,
            colors: this.get("colors"),
            name: l.translateAny("Fill"),
            description: l.translateAny("Fill color"),
        });
        fillControl.hide();
        fillControl.setPrivate("color", this.get("fillColor", color(0x000000)));
        fillControl.setPrivate("opacity", this.get("fillOpacity", 1));
        toolsContainer.appendChild(fillControl.getPrivate("button"));
        this.setPrivate("fillControl", fillControl);
        fillControl.events.on("selected", (ev) => {
            this.set("fillColor", ev.color);
        });
        fillControl.events.on("selectedOpacity", (ev) => {
            this.set("fillOpacity", ev.opacity);
        });
        fillControl.events.on("click", this._resetControls, this);
        /**
         * Label color control
         */
        const labelFillControl = ColorControl.new(this._root, {
            stockChart: stockChart,
            colors: this.get("colors"),
            name: l.translateAny("Text"),
            description: l.translateAny("Text color"),
            useOpacity: false
        });
        labelFillControl.hide();
        labelFillControl.setPrivate("color", this.get("labelFill", color(0x000000)));
        toolsContainer.appendChild(labelFillControl.getPrivate("button"));
        this.setPrivate("labelFillControl", labelFillControl);
        labelFillControl.events.on("selected", (ev) => {
            this.set("labelFill", ev.color);
        });
        labelFillControl.events.on("click", this._resetControls, this);
        /**
         * Font size control
         */
        const fontSizes = [];
        $array.each(this.get("labelFontSizes", []), (size) => {
            fontSizes.push(size + "");
        });
        const fontSizeControl = DropdownListControl.new(this._root, {
            stockChart: stockChart,
            description: l.translateAny("Label font size"),
            currentItem: this.get("labelFontSize", "12px") + "",
            items: fontSizes,
        });
        fontSizeControl.hide();
        //fontSizeControl.setItem(this.get("labelFontSize", "12px") + "");
        toolsContainer.appendChild(fontSizeControl.getPrivate("button"));
        this.setPrivate("labelFontSizeControl", fontSizeControl);
        fontSizeControl.events.on("selected", (ev) => {
            this.set("labelFontSize", $type.isString(ev.item) ? ev.item : ev.item.id);
        });
        fontSizeControl.events.on("click", this._resetControls, this);
        /**
         * Bold control
         */
        const boldControl = StockControl.new(this._root, {
            stockChart: stockChart,
            description: l.translateAny("Bold"),
            icon: StockIcons.getIcon("Bold")
        });
        boldControl.hide();
        toolsContainer.appendChild(boldControl.getPrivate("button"));
        this.setPrivate("boldControl", boldControl);
        boldControl.on("active", (_ev) => {
            this.set("labelFontWeight", boldControl.get("active") ? "bold" : "normal");
        });
        boldControl.events.on("click", this._resetControls, this);
        /**
         * Italic control
         */
        const italicControl = StockControl.new(this._root, {
            stockChart: stockChart,
            description: l.translateAny("Italic"),
            icon: StockIcons.getIcon("Italic")
        });
        italicControl.hide();
        toolsContainer.appendChild(italicControl.getPrivate("button"));
        this.setPrivate("italicControl", italicControl);
        italicControl.on("active", (_ev) => {
            this.set("labelFontStyle", italicControl.get("active") ? "italic" : "normal");
        });
        italicControl.events.on("click", this._resetControls, this);
        /**
         * Font family control
         */
        const fontFamilies = [];
        $array.each(this.get("labelFontFamilies", []), (size) => {
            fontFamilies.push(size + "");
        });
        const fontFamilyControl = DropdownListControl.new(this._root, {
            stockChart: stockChart,
            description: l.translateAny("Label font family"),
            currentItem: this.get("labelFontFamily", "Arial"),
            items: fontFamilies,
        });
        fontFamilyControl.hide();
        toolsContainer.appendChild(fontFamilyControl.getPrivate("button"));
        this.setPrivate("labelFontFamilyControl", fontFamilyControl);
        fontFamilyControl.events.on("selected", (ev) => {
            this.set("labelFontFamily", $type.isString(ev.item) ? ev.item : ev.item.id);
        });
        fontFamilyControl.events.on("click", this._resetControls, this);
        /**
         * Line extension control
         */
        const extensionControl = StockControl.new(this._root, {
            stockChart: stockChart,
            description: l.translateAny("Show line extension"),
            icon: StockIcons.getIcon("Show Extension")
        });
        extensionControl.hide();
        toolsContainer.appendChild(extensionControl.getPrivate("button"));
        this.setPrivate("extensionControl", extensionControl);
        if (this.get("showExtension")) {
            extensionControl.set("active", true);
        }
        extensionControl.on("active", (_ev) => {
            this.set("showExtension", extensionControl.get("active") == true);
        });
        extensionControl.events.on("click", this._resetControls, this);
        /**
         * Eraser control
         */
        const eraserControl = StockControl.new(this._root, {
            stockChart: stockChart,
            description: l.translateAny("Eraser"),
            icon: StockIcons.getIcon("Eraser")
        });
        toolsContainer.appendChild(eraserControl.getPrivate("button"));
        this.setPrivate("eraserControl", eraserControl);
        eraserControl.on("active", (_ev) => {
            const active = eraserControl.get("active", false);
            this.setEraser(active);
        });
        /**
         * Clear all drawings control
         */
        const clearControl = StockControl.new(this._root, {
            stockChart: stockChart,
            name: l.translateAny("Clear"),
            description: l.translateAny("Clear all drawings"),
            icon: StockIcons.getIcon("Clear"),
            togglable: false
        });
        toolsContainer.appendChild(clearControl.getPrivate("button"));
        this.setPrivate("clearControl", clearControl);
        this._disposers.push($utils.addEventListener(clearControl.getPrivate("button"), "click", (_ev) => {
            eraserControl.set("active", false);
            this.clearDrawings();
        }));
        // Preset active tool
        if (this.get("active")) {
            this._setTool(this.get("tool"));
        }
    }
    /**
     * Enables or disables eraser tool.
     *
     * @since 5.3.9
     * @param  active  Eraser active
     */
    setEraser(active) {
        $object.each(this._drawingSeries, (_tool, seriesList) => {
            $array.each(seriesList, (series) => {
                if (active) {
                    series.enableErasing();
                }
                else {
                    series.disableErasing();
                }
            });
        });
    }
    /**
     * Clears all drawings.
     *
     * @since 5.3.9
     */
    clearDrawings() {
        $object.each(this._drawingSeries, (_tool, seriesList) => {
            $array.each(seriesList, (series) => {
                //series.disableErasing();
                series.clearDrawings();
            });
        });
    }
    _beforeChanged() {
        super._beforeChanged();
        const isInited = this._isInited();
        if (this.isDirty("tools")) {
            const toolControl = this.getPrivate("toolControl");
            if (toolControl) {
                toolControl.set("tools", this.get("tools"));
            }
        }
        if (this.isPrivateDirty("toolbar")) {
            if (this.getPrivate("toolbar")) {
                this._initToolbar();
            }
        }
        if (this.isDirty("active")) {
            if (this.get("active")) {
                if (isInited) {
                    this.getPrivate("toolsContainer").style.display = "block";
                }
                this._setTool(this.get("tool"));
            }
            else {
                if (isInited) {
                    this.getPrivate("toolsContainer").style.display = "none";
                }
                this._setTool();
            }
        }
        if (this.isDirty("tool") && this.get("active")) {
            this._setTool(this.get("tool"));
        }
        if (this.isDirty("strokeColor") || this.isDirty("strokeWidth") || this.isDirty("strokeOpacity") || this.isDirty("strokeDasharray")) {
            this._setStroke();
        }
        if (this.isDirty("fillColor") || this.isDirty("fillOpacity")) {
            this._setFill();
        }
        if (this.isDirty("labelFill") || this.isDirty("labelFontSize") || this.isDirty("labelFontFamily") || this.isDirty("labelFontWeight") || this.isDirty("labelFontStyle")) {
            this._setLabel();
        }
        if (this.isDirty("showExtension")) {
            this._setExtension();
        }
        if (this.isDirty("drawingIcon")) {
            this._setDrawingIcon();
        }
        if (this.isDirty("snapToData")) {
            this._setSnap();
        }
    }
    _setTool(tool) {
        const isInited = this._isInited();
        // Disable current drawing series
        $array.each(this._currentEnabledSeries, (series) => {
            series.disableDrawing();
        });
        this._currentEnabledSeries = [];
        // Disable editing
        if (!tool) {
            if (isInited) {
                this.getPrivate("eraserControl").set("active", false);
            }
            return;
        }
        // Check if we need to create series
        this._maybeInitToolSeries(tool);
        let seriesList = this._drawingSeries[tool];
        let prevPanel;
        $array.each(seriesList, (series) => {
            if (prevPanel !== series.chart) {
                series.enableDrawing();
                this._currentEnabledSeries.push(series);
                prevPanel = series.chart;
            }
        });
        if (isInited) {
            this.getPrivate("toolControl").setTool(tool);
            // Show/hide needed drawing property controls
            const controls = {
                strokeControl: ["Average", "Callout", "Doodle", "Ellipse", "Fibonacci", "Fibonacci Timezone", "Horizontal Line", "Horizontal Ray", "Arrows &amp; Icons", "Line", "Parallel Channel", "Polyline", "Quadrant Line", "Rectangle", "Regression", "Trend Line", "Vertical Line"],
                strokeWidthControl: ["Average", "Doodle", "Ellipse", "Horizontal Line", "Horizontal Ray", "Line", "Polyline", "Quadrant Line", "Rectangle", "Regression", "Trend Line", "Vertical Line", "Parallel Channel"],
                strokeDasharrayControl: ["Average", "Doodle", "Ellipse", "Horizontal Line", "Horizontal Ray", "Line", "Polyline", "Quadrant Line", "Rectangle", "Regression", "Trend Line", "Vertical Line"],
                extensionControl: ["Average", "Line", "Regression", "Trend Line"],
                fillControl: ["Callout", "Ellipse", "Quadrant Line", "Rectangle", "Parallel Channel", "Arrows &amp; Icons", "Fibonacci Timezone"],
                labelFillControl: ["Callout", "Label"],
                labelFontSizeControl: ["Callout", "Label"],
                labelFontFamilyControl: ["Callout", "Label"],
                boldControl: ["Callout", "Label"],
                italicControl: ["Callout", "Label"],
                iconControl: ["Arrows &amp; Icons"],
                snapControl: ["Callout", "Arrows &amp; Icons", "Line", "Polyline", "Parallel Channel", "Label", "Callout", "Horizontal Line", "Horizontal Ray", "Vertical Line", "Quadrant Line", "Rectangle", "Measure", "Fibonacci"],
            };
            $object.each(controls, (control, tools) => {
                const controlElement = this.getPrivate(control);
                if (tools.indexOf(tool) == -1) {
                    controlElement.hide();
                }
                else {
                    controlElement.show();
                }
                //controlElement!.getPrivate("button").style.display = tools.indexOf(tool) == -1 ? "none" : "";
            });
        }
    }
    _maybeInitToolSeries(tool) {
        let seriesList = this._drawingSeries[tool];
        if (!seriesList) {
            seriesList = [];
        }
        // Get target series
        const chartSeries = this.get("series", []);
        const stockChart = this.get("stockChart");
        if (chartSeries.length == 0) {
            // No target series set, take first series out of each chart
            stockChart.panels.each((panel) => {
                if ((seriesList.length === 0 || this._initedPanels.indexOf(panel) === -1) && (panel.series.length > 0)) {
                    chartSeries.push(panel.series.getIndex(0));
                    this._initedPanels.push(panel);
                }
            });
        }
        if (chartSeries.length > 0) {
            const toolSettings = this.get("toolSettings", {});
            // Populate the list
            $array.each(chartSeries, (chartSeries) => {
                let series;
                const xAxis = chartSeries.get("xAxis");
                const yAxis = chartSeries.get("yAxis");
                const panel = chartSeries.chart;
                let template;
                if (toolSettings[tool]) {
                    template = Template.new(toolSettings[tool]);
                    const toolTemplates = this.getPrivate("toolTemplates", {});
                    toolTemplates[tool] = template;
                    this.setPrivate("toolTemplates", toolTemplates);
                }
                switch (tool) {
                    case "Arrows &amp; Icons":
                        const icon = this.get("drawingIcon", this.get("drawingIcons")[0]);
                        series = IconSeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis,
                            iconSvgPath: icon.svgPath,
                            iconScale: icon.scale,
                            iconCenterX: icon.centerX,
                            iconCenterY: icon.centerY,
                        }, template);
                        break;
                    case "Average":
                        series = AverageSeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        break;
                    case "Callout":
                        series = CalloutSeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        break;
                    case "Doodle":
                        series = DoodleSeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        series.fills.template.setAll({
                            forceHidden: true
                        });
                        break;
                    case "Ellipse":
                        series = EllipseSeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        break;
                    case "Fibonacci":
                        series = FibonacciSeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        break;
                    case "Fibonacci Timezone":
                        series = FibonacciTimezoneSeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        break;
                    case "Horizontal Line":
                        series = HorizontalLineSeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        break;
                    case "Horizontal Ray":
                        series = HorizontalRaySeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        break;
                    case "Label":
                        series = LabelSeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        break;
                    case "Line":
                        series = SimpleLineSeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        break;
                    case "Measure":
                        series = Measure.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        break;
                    case "Parallel Channel":
                        series = ParallelChannelSeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        break;
                    case "Polyline":
                        series = PolylineSeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        series.fills.template.setAll({
                            forceHidden: true
                        });
                        break;
                    case "Quadrant Line":
                        series = QuadrantLineSeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        break;
                    case "Rectangle":
                        series = RectangleSeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        break;
                    case "Regression":
                        series = RegressionSeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        break;
                    case "Trend Line":
                        series = TrendLineSeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        break;
                    case "Vertical Line":
                        series = VerticalLineSeries.new(this._root, {
                            series: chartSeries,
                            xAxis: xAxis,
                            yAxis: yAxis
                        }, template);
                        break;
                }
                if (series) {
                    seriesList.push(series);
                    panel.drawings.push(series);
                    series.setPrivate("baseValueSeries", chartSeries);
                    series.set("valueYShow", chartSeries.get("valueYShow"));
                    series.set("calculateAggregates", true);
                }
            });
            this._drawingSeries[tool] = seriesList;
            this._setStroke();
            this._setFill();
            this._setLabel();
            this._setDrawingIcon();
            this._setSnap();
            this._setExtension();
        }
    }
    _setStroke() {
        $object.each(this._drawingSeries, (_tool, seriesList) => {
            $array.each(seriesList, (series) => {
                series.setAll({
                    strokeColor: this.get("strokeColor"),
                    strokeWidth: this.get("strokeWidth"),
                    strokeOpacity: this.get("strokeOpacity"),
                    strokeDasharray: this.get("strokeDasharray"),
                });
            });
        });
    }
    _setFill() {
        $object.each(this._drawingSeries, (_tool, seriesList) => {
            $array.each(seriesList, (series) => {
                series.setAll({
                    fillColor: this.get("fillColor"),
                    fillOpacity: this.get("fillOpacity")
                });
            });
        });
    }
    _setLabel() {
        const labelTools = ["Callout", "Label"];
        $object.each(this._drawingSeries, (tool, seriesList) => {
            if (labelTools.indexOf(tool) != -1) {
                $array.each(seriesList, (series) => {
                    series.setAll({
                        labelFill: this.get("labelFill"),
                        labelFontSize: this.get("labelFontSize"),
                        labelFontFamily: this.get("labelFontFamily"),
                        labelFontWeight: this.get("labelFontWeight"),
                        labelFontStyle: this.get("labelFontStyle")
                    });
                });
            }
        });
    }
    _setExtension() {
        $object.each(this._drawingSeries, (_tool, seriesList) => {
            $array.each(seriesList, (series) => {
                if (series instanceof SimpleLineSeries) {
                    series.setAll({
                        showExtension: this.get("showExtension")
                    });
                }
            });
        });
    }
    _setDrawingIcon() {
        if (!this._isInited()) {
            return;
        }
        const icon = this.get("drawingIcon", this.get("drawingIcons")[0]);
        const fillControl = this.getPrivate("fillControl");
        if (icon.fillDisabled) {
            fillControl.hide();
        }
        else {
            fillControl.show();
        }
        $object.each(this._drawingSeries, (_tool, seriesList) => {
            $array.each(seriesList, (series) => {
                if (series instanceof IconSeries) {
                    series.setAll({
                        iconSvgPath: icon.svgPath,
                        iconScale: icon.scale,
                        iconCenterX: icon.centerX,
                        iconCenterY: icon.centerY,
                        fillOpacity: icon.fillDisabled ? 0 : this.get("fillOpacity")
                    });
                }
            });
        });
    }
    _setSnap() {
        const snap = this.get("snapToData", false);
        $object.each(this._drawingSeries, (_tool, seriesList) => {
            $array.each(seriesList, (series) => {
                if (series.getPrivate("allowChangeSnap")) {
                    series.set("snapToData", snap);
                }
            });
        });
    }
    _getDefaultIcon() {
        return StockIcons.getIcon("Draw");
    }
    _dispose() {
        super._dispose();
        $utils.removeElement(this.getPrivate("toolsContainer"));
    }
    _getSeriesTool(series) {
        if (series instanceof DrawingSeries) {
            let name = series.className;
            if (name == "SimpleLineSeries") {
                return "Line";
            }
            else if (name == "IconSeries") {
                return "Arrows &amp; Icons";
            }
            name = $utils.addSpacing(name.replace("Series", ""));
            return name;
        }
    }
    /**
     * Serializes all drawings into an array of simple objects or JSON.
     *
     * `output` parameter can either be `"object"` or `"string"` (default).
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/serializing-indicators-annotations/} for more info
     * @since 5.3.0
     * @param   output Output format
     * @param   indent Line indent in JSON
     * @return         Serialized indicators
     */
    serializeDrawings(output = "string", indent) {
        const res = [];
        this.get("stockChart").panels.each((panel, panelIndex) => {
            panel.series.each((series) => {
                if (series.isType("DrawingSeries")) {
                    const serializer = Serializer.new(this.root, {
                        includeSettings: ["strokeColor", "fillColor", "strokeOpacity", "fillOpacity", "strokeWidth", "strokeDasharray", "field", "snapToData", "svgPath", "labelFontSize", "labelFontFamily", "labelFontWeight", "labelFontStyle", "labelFill", "showExtension"],
                        //includeSettings: ["data"],
                        maxDepth: 4
                    });
                    series.data.values.map((row) => {
                        row.__parse = true;
                    });
                    const json = {
                        __tool: this._getSeriesTool(series),
                        __panelIndex: panelIndex,
                        __drawing: serializer.serialize(series.data.values, 0, true)
                    };
                    //json.__panelIndex = panelIndex;
                    res.push(json);
                }
            });
        });
        return output == "object" ? res : JSON.stringify(res, undefined, indent);
    }
    /**
     * Parses data serialized with `serializeDrawings()` and adds drawings to the
     * chart.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/serializing-indicators-annotations/} for more info
     * @since 5.3.0
     * @param  data Serialized data
     */
    unserializeDrawings(data) {
        const stockChart = this.get("stockChart");
        if ($type.isString(data)) {
            data = JSON.parse(data);
        }
        if (!$type.isArray(data)) {
            data = [data];
        }
        $array.each(data, (drawing) => {
            // Panel
            let panel = stockChart.panels.getIndex(drawing.__panelIndex || 0);
            if (panel) {
                const tool = drawing.__tool;
                this._maybeInitToolSeries(tool);
                // Get series
                let drawingSeries;
                $array.each(this._drawingSeries[tool] || [], (series) => {
                    if (series.chart === panel) {
                        drawingSeries = series;
                    }
                });
                if (!drawing.settings) {
                    drawing.settings = {};
                }
                // Parse
                JsonParser.new(this._root).parse(drawing.__drawing).then((drawingData) => {
                    drawingSeries.data.pushAll(drawingData);
                });
            }
            else {
                // Wait until panel becomes available
                stockChart.panels.events.once("push", (ev) => {
                    ev.newValue.series.events.once("push", (_ev) => {
                        this.unserializeDrawings(drawing);
                    });
                });
            }
        });
    }
}
Object.defineProperty(DrawingControl, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "DrawingControl"
});
Object.defineProperty(DrawingControl, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: StockControl.classNames.concat([DrawingControl.className])
});
//# sourceMappingURL=DrawingControl.js.map