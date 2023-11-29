import { Container } from "../../core/render/Container";
import { p100 } from "../../core/util/Percent";
import { Graphics } from "../../core/render/Graphics";
import { Grid } from "./axes/Grid";
//import { Animations } from "../core/util/Animation";
import * as $type from "../../core/util/Type";
import * as $utils from "../../core/util/Utils";
import * as $math from "../../core/util/Math";
import * as $array from "../../core/util/Array";
import * as $object from "../../core/util/Object";
/**
 * Creates a chart cursor for an [[XYChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/} for more info
 * @important
 */
export class XYCursor extends Container {
    constructor() {
        super(...arguments);
        /**
         * A [[Grid]] elment that used for horizontal line of the cursor crosshair.
         *
         * @default Grid.new()
         */
        Object.defineProperty(this, "lineX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Grid.new(this._root, {
                themeTags: ["x"]
            }))
        });
        /**
         * A [[Grid]] elment that used for horizontal line of the cursor crosshair.
         *
         * @default Grid.new()
         */
        Object.defineProperty(this, "lineY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Grid.new(this._root, {
                themeTags: ["y"]
            }))
        });
        /**
         * An element that represents current selection.
         *
         * @default Graphics.new()
         */
        Object.defineProperty(this, "selection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Graphics.new(this._root, {
                themeTags: ["selection", "cursor"], layer: 30
            }))
        });
        Object.defineProperty(this, "_movePoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_lastPoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { x: 0, y: 0 }
        });
        Object.defineProperty(this, "_tooltipX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_tooltipY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * A chart cursor is attached to.
         */
        Object.defineProperty(this, "chart", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_toX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_toY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _afterNew() {
        this._settings.themeTags = $utils.mergeTags(this._settings.themeTags, ["xy", "cursor"]);
        super._afterNew();
        this.setAll({ "width": p100, height: p100, isMeasured: true, position: "absolute" });
        this.states.create("hidden", { visible: true, opacity: 0 });
        this._drawLines();
        this.setPrivateRaw("visible", false);
        this._disposers.push(this.setTimeout(() => {
            this.setPrivate("visible", true);
        }, 500));
        this._disposers.push(this.lineX.events.on("positionchanged", () => {
            this._handleXLine();
        }));
        this._disposers.push(this.lineY.events.on("positionchanged", () => {
            this._handleYLine();
        }));
        this._disposers.push(this.lineX.events.on("focus", (ev) => this._handleLineFocus(ev.target)));
        this._disposers.push(this.lineX.events.on("blur", (ev) => this._handleLineBlur(ev.target)));
        this._disposers.push(this.lineY.events.on("focus", (ev) => this._handleLineFocus(ev.target)));
        this._disposers.push(this.lineY.events.on("blur", (ev) => this._handleLineBlur(ev.target)));
        if ($utils.supports("keyboardevents")) {
            this._disposers.push($utils.addEventListener(document, "keydown", (ev) => {
                this._handleLineMove(ev.keyCode);
            }));
        }
    }
    _setUpTouch() {
        const chart = this.chart;
        if (chart) {
            chart.plotContainer._display.cancelTouch = this.get("behavior") != "none" ? true : false;
        }
    }
    _handleXLine() {
        let x = this.lineX.x();
        let visible = true;
        if (x < 0 || x > this.width()) {
            visible = false;
        }
        this.lineX.setPrivate("visible", visible);
    }
    _handleYLine() {
        let y = this.lineY.y();
        let visible = true;
        if (y < 0 || y > this.height()) {
            visible = false;
        }
        this.lineY.setPrivate("visible", visible);
    }
    _handleLineMove(keyCode) {
        let dir = "";
        let position = 0;
        let increment = 0.1;
        const chart = this.chart;
        if (this._root.focused(this.lineX)) {
            if (chart && chart.xAxes.length) {
                increment = chart.xAxes.getIndex(0).getCellWidthPosition();
            }
            position = this.getPrivate("positionX", 0);
            dir = "positionX";
            if (keyCode == 37) {
                position -= increment;
            }
            else if (keyCode == 39) {
                position += increment;
            }
        }
        else if (this._root.focused(this.lineY)) {
            if (chart && chart.yAxes.length) {
                increment = chart.yAxes.getIndex(0).getCellWidthPosition();
            }
            position = this.getPrivate("positionY", 0);
            dir = "positionY";
            if (keyCode == 38) {
                position -= increment;
            }
            else if (keyCode == 40) {
                position += increment;
            }
        }
        if (position < 0) {
            position = 0;
        }
        else if (position > 1) {
            position = 1;
        }
        if (dir != "") {
            this.set(dir, position);
        }
    }
    _handleLineFocus(_line) {
        this.setAll({
            positionX: this.getPrivate("positionX"),
            positionY: this.getPrivate("positionY"),
            alwaysShow: true
        });
    }
    _handleLineBlur(_line) {
        this.setAll({
            positionX: undefined,
            positionY: undefined,
            alwaysShow: false
        });
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this.isDirty("xAxis")) {
            this._tooltipX = false;
            const xAxis = this.get("xAxis");
            if (xAxis) {
                const tooltip = xAxis.get("tooltip");
                if (tooltip) {
                    this._tooltipX = true;
                    this._disposers.push(tooltip.on("pointTo", () => {
                        this._updateXLine(tooltip);
                    }));
                }
            }
        }
        if (this.isDirty("yAxis")) {
            this._tooltipY = false;
            const yAxis = this.get("yAxis");
            if (yAxis) {
                const tooltip = yAxis.get("tooltip");
                if (tooltip) {
                    this._tooltipY = true;
                    this._disposers.push(tooltip.on("pointTo", () => {
                        this._updateYLine(tooltip);
                    }));
                }
            }
        }
    }
    _handleSyncWith() {
        const chart = this.chart;
        if (chart) {
            const syncWith = this.get("syncWith");
            const otherCharts = [];
            if (syncWith) {
                $array.each(syncWith, (cursor) => {
                    const chart = cursor.chart;
                    if (chart) {
                        otherCharts.push(chart);
                    }
                });
            }
            chart._otherCharts = otherCharts;
        }
    }
    _updateChildren() {
        super._updateChildren();
        this._handleSyncWith();
        if (this.isDirty("positionX") || this.isDirty("positionY")) {
            const positionX = this.get("positionX");
            const positionY = this.get("positionY");
            if (positionX == null && positionY == null) {
                this.hide(0);
            }
            else {
                this._movePoint = this.toGlobal(this._getPoint(this.get("positionX", 0), this.get("positionY", 0)));
                this.handleMove();
            }
        }
    }
    _updateXLine(tooltip) {
        let x = $math.round(this._display.toLocal(tooltip.get("pointTo", { x: 0, y: 0 })).x, 2);
        if (this._toX != x) {
            this.lineX.animate({ key: "x", to: x, duration: tooltip.get("animationDuration", 0), easing: tooltip.get("animationEasing") });
            this._toX = x;
        }
    }
    _updateYLine(tooltip) {
        let y = $math.round(this._display.toLocal(tooltip.get("pointTo", { x: 0, y: 0 })).y, 2);
        if (this._toY != y) {
            this.lineY.animate({ key: "y", to: y, duration: tooltip.get("animationDuration", 0), easing: tooltip.get("animationEasing") });
            this._toY = y;
        }
    }
    _drawLines() {
        this.lineX.set("draw", (display) => {
            display.moveTo(0, 0);
            display.lineTo(0, this.height());
        });
        this.lineY.set("draw", (display) => {
            display.moveTo(0, 0);
            display.lineTo(this.width(), 0);
        });
    }
    updateCursor() {
        if (this.get("alwaysShow")) {
            this._movePoint = this.toGlobal(this._getPoint(this.get("positionX", 0), this.get("positionY", 0)));
        }
        this.handleMove();
    }
    _setChart(chart) {
        this.chart = chart;
        this._handleSyncWith();
        const plotContainer = chart.plotContainer;
        this.events.on("boundschanged", () => {
            this._disposers.push(this.setTimeout(() => {
                this.updateCursor();
            }, 50));
        });
        //this._display.interactive = true;
        if ($utils.supports("touchevents")) {
            this._disposers.push(plotContainer.events.on("click", (event) => {
                if ($utils.isTouchEvent(event.originalEvent)) {
                    this._handleMove(event);
                }
            }));
            this._setUpTouch();
        }
        this._disposers.push(plotContainer.events.on("pointerdown", (event) => {
            this._handleCursorDown(event);
        }));
        this._disposers.push(plotContainer.events.on("globalpointerup", (event) => {
            this._handleCursorUp(event);
            if (!event.native && !this.isHidden()) {
                this._handleMove(event);
            }
        }));
        this._disposers.push(plotContainer.events.on("globalpointermove", (event) => {
            if (!this.get("syncWith")) {
                if ($object.keys(plotContainer._downPoints).length == 0 && !event.native && this.isHidden()) {
                    // Ignore mouse movement if it originates on outside element and
                    // we're not dragging.
                    return;
                }
            }
            this._handleMove(event);
        }));
        const parent = this.parent;
        if (parent) {
            parent.children.moveValue(this.selection);
        }
    }
    _inPlot(point) {
        const chart = this.chart;
        if (chart) {
            return chart.inPlot(point);
        }
        return false;
    }
    _handleCursorDown(event) {
        if (event.originalEvent.button == 2) {
            return;
        }
        const rootPoint = event.point;
        let local = this._display.toLocal(rootPoint);
        const chart = this.chart;
        this.selection.set("draw", () => { });
        if (chart && this._inPlot(local)) {
            this._downPoint = local;
            if (this.get("behavior") != "none") {
                this.selection.show();
                const type = "selectstarted";
                if (this.events.isEnabled(type)) {
                    this.events.dispatch(type, { type: type, target: this, originalEvent: event.originalEvent });
                }
            }
            let positionX = this._getPosition(local).x;
            let positionY = this._getPosition(local).y;
            this.setPrivate("downPositionX", positionX);
            this.setPrivate("downPositionY", positionY);
        }
    }
    _handleCursorUp(event) {
        // TODO: handle multitouch
        if (this._downPoint) {
            const behavior = this.get("behavior", "none");
            if (behavior != "none") {
                if (behavior.charAt(0) === "z") {
                    this.selection.hide();
                }
                const rootPoint = event.point;
                let local = this._display.toLocal(rootPoint);
                const downPoint = this._downPoint;
                const moveThreshold = this.get("moveThreshold", 1);
                if (local && downPoint) {
                    let dispatch = false;
                    if (behavior === "zoomX" || behavior === "zoomXY" || behavior === "selectX" || behavior === "selectXY") {
                        if (Math.abs(local.x - downPoint.x) > moveThreshold) {
                            dispatch = true;
                        }
                    }
                    if (behavior === "zoomY" || behavior === "zoomXY" || behavior === "selectY" || behavior === "selectXY") {
                        if (Math.abs(local.y - downPoint.y) > moveThreshold) {
                            dispatch = true;
                        }
                    }
                    if (dispatch) {
                        const type = "selectended";
                        if (this.events.isEnabled(type)) {
                            this.events.dispatch(type, { type: type, target: this, originalEvent: event.originalEvent });
                        }
                    }
                    else {
                        const type = "selectcancelled";
                        if (this.events.isEnabled(type)) {
                            this.events.dispatch(type, { type: type, target: this, originalEvent: event.originalEvent });
                        }
                    }
                }
            }
        }
        this._downPoint = undefined;
    }
    _handleMove(event) {
        if (this.getPrivate("visible")) {
            const chart = this.chart;
            if (chart && $object.keys(chart.plotContainer._downPoints).length > 1) {
                this.set("forceHidden", true);
                return;
            }
            else {
                this.set("forceHidden", false);
            }
            // TODO: handle multitouch
            const rootPoint = event.point;
            const lastPoint = this._lastPoint;
            if (Math.round(lastPoint.x) === Math.round(rootPoint.x) && Math.round(lastPoint.y) === Math.round(rootPoint.y)) {
                return;
            }
            this._lastPoint = rootPoint;
            this.setPrivate("lastPoint", rootPoint);
            this.handleMove({ x: rootPoint.x, y: rootPoint.y }, false, event.originalEvent);
        }
    }
    _getPosition(point) {
        return { x: point.x / this.width(), y: point.y / this.height() };
    }
    /**
     * Moves the cursor to X/Y coordinates within chart container (`point`).
     *
     * If `skipEvent` parameter is set to `true`, the move will not invoke
     * the `"cursormoved"` event.
     *
     * @param  point      X/Y to move cursor to
     * @param  skipEvent  Do not fire "cursormoved" event
     */
    handleMove(point, skipEvent, originalEvent) {
        if (!point) {
            point = this._movePoint;
        }
        const alwaysShow = this.get("alwaysShow");
        if (!point) {
            this.hide(0);
            return;
        }
        this._movePoint = point;
        let local = this._display.toLocal(point);
        let chart = this.chart;
        if (chart && (this._inPlot(local) || this._downPoint)) {
            chart._movePoint = point;
            if (this.isHidden()) {
                this.show();
                const behavior = this.get("behavior", "");
                if (behavior.charAt(0) == "z") {
                    this.selection.set("draw", () => { });
                }
            }
            let x = local.x;
            let y = local.y;
            let xyPos = this._getPosition(local);
            this.setPrivate("point", local);
            let snapToSeries = this.get("snapToSeries");
            if (this._downPoint) {
                snapToSeries = undefined;
            }
            let userPositionX = this.get("positionX");
            let positionX = xyPos.x;
            if ($type.isNumber(userPositionX)) {
                positionX = userPositionX;
            }
            let userPositionY = this.get("positionY");
            let positionY = xyPos.y;
            if ($type.isNumber(userPositionY)) {
                positionY = userPositionY;
            }
            this.setPrivate("positionX", positionX);
            this.setPrivate("positionY", positionY);
            const xy = this._getPoint(positionX, positionY);
            x = xy.x;
            y = xy.y;
            chart.xAxes.each((axis) => {
                axis._handleCursorPosition(positionX, snapToSeries);
                if (alwaysShow) {
                    axis.handleCursorShow();
                }
            });
            chart.yAxes.each((axis) => {
                axis._handleCursorPosition(positionY, snapToSeries);
                if (alwaysShow) {
                    axis.handleCursorShow();
                }
            });
            if (!skipEvent) {
                chart._handleCursorPosition();
                const type = "cursormoved";
                if (this.events.isEnabled(type)) {
                    this.events.dispatch(type, { type: type, target: this, point: point, originalEvent: originalEvent });
                }
            }
            this._updateLines(x, y);
            chart.arrangeTooltips();
        }
        else if (!this._downPoint) {
            if (!alwaysShow) {
                this.hide(0);
                const type = "cursorhidden";
                if (this.events.isEnabled(type)) {
                    this.events.dispatch(type, { type: type, target: this });
                }
            }
        }
        if (this._downPoint && this.get("behavior") != "none") {
            this._updateSelection(local);
        }
    }
    _getPoint(positionX, positionY) {
        return { x: this.width() * positionX, y: this.height() * positionY };
    }
    _updateLines(x, y) {
        if (!this._tooltipX) {
            this.lineX.set("x", x);
        }
        if (!this._tooltipY) {
            this.lineY.set("y", y);
        }
        this._drawLines();
    }
    _updateSelection(point) {
        const selection = this.selection;
        const behavior = this.get("behavior");
        const w = this.width();
        const h = this.height();
        if (point.x < 0) {
            point.x = 0;
        }
        if (point.x > w) {
            point.x = w;
        }
        if (point.y < 0) {
            point.y = 0;
        }
        if (point.y > h) {
            point.y = h;
        }
        selection.set("draw", (display) => {
            const downPoint = this._downPoint;
            if (downPoint) {
                if (behavior === "zoomXY" || behavior === "selectXY") {
                    display.moveTo(downPoint.x, downPoint.y);
                    display.lineTo(downPoint.x, point.y);
                    display.lineTo(point.x, point.y);
                    display.lineTo(point.x, downPoint.y);
                    display.lineTo(downPoint.x, downPoint.y);
                }
                else if (behavior === "zoomX" || behavior === "selectX") {
                    display.moveTo(downPoint.x, 0);
                    display.lineTo(downPoint.x, h);
                    display.lineTo(point.x, h);
                    display.lineTo(point.x, 0);
                    display.lineTo(downPoint.x, 0);
                }
                else if (behavior === "zoomY" || behavior === "selectY") {
                    display.moveTo(0, downPoint.y);
                    display.lineTo(w, downPoint.y);
                    display.lineTo(w, point.y);
                    display.lineTo(0, point.y);
                    display.lineTo(0, downPoint.y);
                }
            }
        });
    }
    _onHide() {
        if (this.isHidden()) {
            let chart = this.chart;
            if (chart) {
                chart.xAxes.each((axis) => {
                    axis.handleCursorHide();
                });
                chart.yAxes.each((axis) => {
                    axis.handleCursorHide();
                });
                chart.series.each((series) => {
                    series.handleCursorHide();
                });
            }
        }
        super._onHide();
    }
    _onShow() {
        if (!this.isHidden()) {
            let chart = this.chart;
            if (chart) {
                chart.xAxes.each((axis) => {
                    axis.handleCursorShow();
                });
                chart.yAxes.each((axis) => {
                    axis.handleCursorShow();
                });
            }
        }
        super._onShow();
    }
    _dispose() {
        super._dispose();
        this.selection.dispose();
    }
}
Object.defineProperty(XYCursor, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "XYCursor"
});
Object.defineProperty(XYCursor, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Container.classNames.concat([XYCursor.className])
});
//# sourceMappingURL=XYCursor.js.map