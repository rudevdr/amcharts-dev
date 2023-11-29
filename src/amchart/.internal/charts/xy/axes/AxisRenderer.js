import { Graphics } from "../../../core/render/Graphics";
import { Template } from "../../../core/util/Template";
import { ListTemplate } from "../../../core/util/List";
import { AxisTick } from "./AxisTick";
import { Grid } from "./Grid";
import { AxisLabel } from "./AxisLabel";
import * as $utils from "../../../core/util/Utils";
/**
 * Base class for an axis renderer.
 *
 * Should not be used on its own.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/#Axis_renderer} for more info
 */
export class AxisRenderer extends Graphics {
    constructor() {
        super(...arguments);
        // save for quick access
        Object.defineProperty(this, "_axisLength", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 100
        });
        Object.defineProperty(this, "_start", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_end", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "_inversed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_minSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        /**
         * Chart the renderer is used in.
         */
        Object.defineProperty(this, "chart", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_lc", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "_ls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_thumbDownPoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_downStart", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_downEnd", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * A list of ticks in the axis.
         *
         * `ticks.template` can be used to configure ticks.
         *
         * @default new ListTemplate<AxisTick>
         */
        Object.defineProperty(this, "ticks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => AxisTick._new(this._root, {
                themeTags: $utils.mergeTags(this.ticks.template.get("themeTags", []), this.get("themeTags", []))
            }, [this.ticks.template]))
        });
        /**
         * A list of grid elements in the axis.
         *
         * `grid.template` can be used to configure grid.
         *
         * @default new ListTemplate<Grid>
         */
        Object.defineProperty(this, "grid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Grid._new(this._root, {
                themeTags: $utils.mergeTags(this.grid.template.get("themeTags", []), this.get("themeTags", []))
            }, [this.grid.template]))
        });
        /**
         * A list of fills in the axis.
         *
         * `axisFills.template` can be used to configure axis fills.
         *
         * @default new ListTemplate<Graphics>
         */
        Object.defineProperty(this, "axisFills", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Graphics._new(this._root, {
                themeTags: $utils.mergeTags(this.axisFills.template.get("themeTags", ["axis", "fill"]), this.get("themeTags", []))
            }, [this.axisFills.template]))
        });
        /**
         * A list of labels in the axis.
         *
         * `labels.template` can be used to configure axis labels.
         *
         * @default new ListTemplate<AxisLabel>
         */
        Object.defineProperty(this, "labels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => AxisLabel._new(this._root, {
                themeTags: $utils.mergeTags(this.labels.template.get("themeTags", []), this.get("themeTags", []))
            }, [this.labels.template]))
        });
        /**
         * An [[Axis]] renderer is for.
         */
        Object.defineProperty(this, "axis", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "thumb", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    /**
     * @ignore
     */
    makeTick(dataItem, themeTags) {
        const tick = this.ticks.make();
        tick._setDataItem(dataItem);
        dataItem.setRaw("tick", tick);
        tick.set("themeTags", $utils.mergeTags(tick.get("themeTags"), themeTags));
        this.axis.labelsContainer.children.push(tick);
        this.ticks.push(tick);
        return tick;
    }
    /**
     * @ignore
     */
    makeGrid(dataItem, themeTags) {
        const grid = this.grid.make();
        grid._setDataItem(dataItem);
        dataItem.setRaw("grid", grid);
        grid.set("themeTags", $utils.mergeTags(grid.get("themeTags"), themeTags));
        this.axis.gridContainer.children.push(grid);
        this.grid.push(grid);
        return grid;
    }
    /**
     * @ignore
     */
    makeAxisFill(dataItem, themeTags) {
        const axisFill = this.axisFills.make();
        axisFill._setDataItem(dataItem);
        axisFill.set("themeTags", $utils.mergeTags(axisFill.get("themeTags"), themeTags));
        this.axis.gridContainer.children.push(axisFill);
        dataItem.setRaw("axisFill", axisFill);
        this.axisFills.push(axisFill);
        return axisFill;
    }
    /**
     * @ignore
     */
    makeLabel(dataItem, themeTags) {
        const label = this.labels.make();
        label.set("themeTags", $utils.mergeTags(label.get("themeTags"), themeTags));
        this.axis.labelsContainer.children.moveValue(label, 0);
        label._setDataItem(dataItem);
        dataItem.setRaw("label", label);
        this.labels.push(label);
        return label;
    }
    axisLength() {
        return 0;
    }
    /**
     * @ignore
     */
    gridCount() {
        return this.axisLength() / this.get("minGridDistance", 50);
    }
    _updatePositions() {
    }
    _afterNew() {
        super._afterNew();
        this.set("isMeasured", false);
        const thumb = this.thumb;
        if (thumb) {
            this._disposers.push(thumb.events.on("pointerdown", (event) => {
                this._handleThumbDown(event);
            }));
            this._disposers.push(thumb.events.on("globalpointerup", (event) => {
                this._handleThumbUp(event);
            }));
            this._disposers.push(thumb.events.on("globalpointermove", (event) => {
                this._handleThumbMove(event);
            }));
        }
    }
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("minGridDistance")) {
            this.root.events.once("frameended", () => {
                this.axis.markDirtySize();
            });
        }
    }
    _changed() {
        super._changed();
        if (this.isDirty("pan")) {
            const thumb = this.thumb;
            if (thumb) {
                const labelsContainer = this.axis.labelsContainer;
                const pan = this.get("pan");
                if (pan == "zoom") {
                    labelsContainer.children.push(thumb);
                }
                else if (pan == "none") {
                    labelsContainer.children.removeValue(thumb);
                }
            }
        }
    }
    _handleThumbDown(event) {
        this._thumbDownPoint = this.toLocal(event.point);
        const axis = this.axis;
        this._downStart = axis.get("start");
        this._downEnd = axis.get("end");
    }
    _handleThumbUp(_event) {
        this._thumbDownPoint = undefined;
    }
    _handleThumbMove(event) {
        const downPoint = this._thumbDownPoint;
        if (downPoint) {
            const point = this.toLocal(event.point);
            const downStart = this._downStart;
            const downEnd = this._downEnd;
            const extra = this._getPan(point, downPoint) * Math.min(1, (downEnd - downStart)) / 2;
            this.axis.zoom(downStart - extra, downEnd + extra, 0);
        }
    }
    _getPan(_point1, _point2) {
        return 0;
    }
    /**
     * Converts relative position (0-1) on axis to a pixel coordinate.
     *
     * @param position  Position (0-1)
     * @return Coordinate (px)
     */
    positionToCoordinate(position) {
        if (this._inversed) {
            return (this._end - position) * this._axisLength;
        }
        else {
            return (position - this._start) * this._axisLength;
        }
    }
    /**
     * @ignore
     */
    updateTooltipBounds(_tooltip) { }
    _updateSize() {
        this.markDirty();
        this._clear = true;
    }
    /**
     * @ignore
     */
    toAxisPosition(position) {
        const start = this._start || 0;
        const end = this._end || 1;
        position = position * (end - start);
        if (!this.get("inversed")) {
            position = start + position;
        }
        else {
            position = end - position;
        }
        return position;
    }
    /**
     * @ignore
     */
    toGlobalPosition(position) {
        const start = this._start || 0;
        const end = this._end || 1;
        if (!this.get("inversed")) {
            position = position - start;
        }
        else {
            position = end - position;
        }
        position = position / (end - start);
        return position;
    }
    /**
     * @ignore
     */
    fixPosition(position) {
        if (this.get("inversed")) {
            return 1 - position;
        }
        return position;
    }
    /**
     * @ignore
     */
    _updateLC() {
    }
    toggleVisibility(sprite, position, minPosition, maxPosition) {
        let axis = this.axis;
        const start = axis.get("start", 0);
        const end = axis.get("end", 1);
        let updatedStart = start + (end - start) * (minPosition - 0.0001);
        let updatedEnd = start + (end - start) * (maxPosition + 0.0001);
        if (position < updatedStart || position > updatedEnd) {
            sprite.setPrivate("visible", false);
        }
        else {
            sprite.setPrivate("visible", true);
        }
    }
    _positionTooltip(tooltip, point) {
        const chart = this.chart;
        if (chart) {
            if (chart.inPlot(point)) {
                tooltip.set("pointTo", this._display.toGlobal(point));
            }
            else {
                tooltip.hide();
            }
        }
    }
    processAxis() { }
}
Object.defineProperty(AxisRenderer, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "AxisRenderer"
});
Object.defineProperty(AxisRenderer, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Graphics.classNames.concat([AxisRenderer.className])
});
//# sourceMappingURL=AxisRenderer.js.map