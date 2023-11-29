import { AxisRenderer } from "./AxisRenderer";
import { p100 } from "../../../core/util/Percent";
import * as $type from "../../../core/util/Type";
import * as $utils from "../../../core/util/Utils";
import { Rectangle } from "../../../core/render/Rectangle";
/**
 * Used to render vertical axis.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/#Axis_renderer} for more info
 * @important
 */
export class AxisRendererY extends AxisRenderer {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_downY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "thumb", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Rectangle.new(this._root, { height: p100, isMeasured: false, themeTags: ["axis", "y", "thumb"] })
        });
    }
    _afterNew() {
        this._settings.themeTags = $utils.mergeTags(this._settings.themeTags, ["renderer", "y"]);
        if (this._settings.opposite) {
            this._settings.themeTags.push("opposite");
        }
        super._afterNew();
        this.setPrivateRaw("letter", "Y");
        const gridTemplate = this.grid.template;
        gridTemplate.set("width", p100);
        gridTemplate.set("height", 0);
        gridTemplate.set("draw", (display, graphics) => {
            display.moveTo(0, 0);
            display.lineTo(graphics.width(), 0);
        });
        this.set("draw", (display, renderer) => {
            display.moveTo(0, 0);
            display.lineTo(0, renderer.height());
        });
    }
    _getPan(point1, point2) {
        return (point1.y - point2.y) / this.height();
    }
    _changed() {
        super._changed();
        const axis = this.axis;
        axis.ghostLabel.setPrivate("visible", !this.get("inside"));
        axis.ghostLabel.set("y", -1000);
        const thumb = this.thumb;
        const opposite = "opposite";
        const inside = "inside";
        const chart = this.chart;
        if (this.isDirty(opposite) || this.isDirty(inside)) {
            const axisChildren = axis.children;
            if (this.get(inside)) {
                axis.addTag(inside);
            }
            else {
                axis.removeTag(inside);
            }
            if (chart) {
                if (this.get(opposite)) {
                    const children = chart.rightAxesContainer.children;
                    if (children.indexOf(axis) == -1) {
                        children.moveValue(axis, 0);
                    }
                    axis.addTag(opposite);
                    axisChildren.moveValue(this, 0);
                }
                else {
                    const children = chart.leftAxesContainer.children;
                    if (children.indexOf(axis) == -1) {
                        children.moveValue(axis);
                    }
                    axis.removeTag(opposite);
                    axisChildren.moveValue(this);
                }
                axis.ghostLabel._applyThemes();
                this.labels.each((label) => {
                    label._applyThemes();
                });
                this.root._markDirtyRedraw();
            }
            axis.markDirtySize();
        }
        const w = axis.labelsContainer.width();
        if (chart) {
            if (this.get(opposite)) {
                thumb.set("centerX", 0);
            }
            else {
                thumb.set("centerX", w);
            }
        }
        thumb.setPrivate("width", w);
    }
    /**
     * @ignore
     */
    processAxis() {
        super.processAxis();
        const axis = this.axis;
        if (axis.get("height") == null) {
            axis.set("height", p100);
        }
        const horizontalLayout = this._root.horizontalLayout;
        axis.set("layout", horizontalLayout);
        axis.labelsContainer.set("height", p100);
        axis.axisHeader.set("layout", horizontalLayout);
    }
    _updatePositions() {
        const axis = this.axis;
        const y = axis.y() - $utils.relativeToValue(axis.get("centerY", 0), axis.height());
        axis.gridContainer.set("y", y);
        axis.topGridContainer.set("y", y);
        axis.bulletsContainer.set("x", this.x());
        const chart = axis.chart;
        if (chart) {
            const plotContainer = chart.plotContainer;
            const axisHeader = axis.axisHeader;
            let height = axis.get("marginTop", 0);
            if (axisHeader.children.length > 0) {
                height = axis.axisHeader.height();
                axis.set("marginTop", height + 1);
            }
            else {
                axisHeader.set("height", height);
            }
            axisHeader.setAll({ y: axis.y() - height, x: -1, width: plotContainer.width() + 2 });
        }
    }
    /**
     * @ignore
     */
    axisLength() {
        return this.axis.innerHeight();
    }
    /**
     * Converts axis relative position to actual coordinate in pixels.
     *
     * @param   position  Position
     * @return            Point
     */
    positionToPoint(position) {
        return { x: 0, y: this.positionToCoordinate(position) };
    }
    /**
     * @ignore
     */
    updateLabel(label, position, endPosition, count) {
        if (label) {
            if (!$type.isNumber(position)) {
                position = 0;
            }
            let location = 0.5;
            if ($type.isNumber(count) && count > 1) {
                location = label.get("multiLocation", location);
            }
            else {
                location = label.get("location", location);
            }
            const opposite = this.get("opposite");
            const inside = label.get("inside", this.get("inside", false));
            if (opposite) {
                label.set("x", 0);
                if (inside) {
                    label.set("position", "absolute");
                }
                else {
                    label.set("position", "relative");
                }
            }
            else {
                if (inside) {
                    label.set("x", 0);
                    label.set("position", "absolute");
                }
                else {
                    label.set("x", undefined);
                    label.set("position", "relative");
                }
            }
            if ($type.isNumber(endPosition) && endPosition != position) {
                position = position + (endPosition - position) * location;
            }
            label.set("y", this.positionToCoordinate(position));
            this.toggleVisibility(label, position, label.get("minPosition", 0), label.get("maxPosition", 1));
        }
    }
    /**
     * @ignore
     */
    updateGrid(grid, position, endPosition) {
        if (grid) {
            if (!$type.isNumber(position)) {
                position = 0;
            }
            let location = grid.get("location", 0.5);
            if ($type.isNumber(endPosition) && endPosition != position) {
                position = position + (endPosition - position) * location;
            }
            grid.set("y", this.positionToCoordinate(position));
            this.toggleVisibility(grid, position, 0, 1);
        }
    }
    /**
     * @ignore
     */
    updateTick(tick, position, endPosition, count) {
        if (tick) {
            if (!$type.isNumber(position)) {
                position = 0;
            }
            let location = 0.5;
            if ($type.isNumber(count) && count > 1) {
                location = tick.get("multiLocation", location);
            }
            else {
                location = tick.get("location", location);
            }
            if ($type.isNumber(endPosition) && endPosition != position) {
                position = position + (endPosition - position) * location;
            }
            tick.set("y", this.positionToCoordinate(position));
            let length = tick.get("length", 0);
            const inside = tick.get("inside", this.get("inside", false));
            if (this.get("opposite")) {
                tick.set("x", 0);
                if (inside) {
                    length *= -1;
                }
            }
            else {
                if (!inside) {
                    length *= -1;
                }
            }
            tick.set("draw", (display) => {
                display.moveTo(0, 0);
                display.lineTo(length, 0);
            });
            this.toggleVisibility(tick, position, tick.get("minPosition", 0), tick.get("maxPosition", 1));
        }
    }
    /**
     * @ignore
     */
    updateBullet(bullet, position, endPosition) {
        if (bullet) {
            const sprite = bullet.get("sprite");
            if (sprite) {
                if (!$type.isNumber(position)) {
                    position = 0;
                }
                let location = bullet.get("location", 0.5);
                if ($type.isNumber(endPosition) && endPosition != position) {
                    position = position + (endPosition - position) * location;
                }
                let bulletPosition = this.axis.roundAxisPosition(position, location);
                let previousBullet = this.axis._bullets[bulletPosition];
                let d = 1;
                if (this.get("opposite")) {
                    d = -1;
                }
                if (bullet.get("stacked")) {
                    if (previousBullet) {
                        let previousSprite = previousBullet.get("sprite");
                        if (previousSprite) {
                            sprite.set("x", previousSprite.x() + previousSprite.width() * d);
                        }
                    }
                    else {
                        sprite.set("x", 0);
                    }
                }
                this.axis._bullets[bulletPosition] = bullet;
                sprite.set("y", this.positionToCoordinate(position));
                this.toggleVisibility(sprite, position, 0, 1);
            }
        }
    }
    /**
     * @ignore
     */
    updateFill(fill, position, endPosition) {
        if (fill) {
            if (!$type.isNumber(position)) {
                position = 0;
            }
            if (!$type.isNumber(endPosition)) {
                endPosition = 1;
            }
            let y0 = this.positionToCoordinate(position);
            let y1 = this.positionToCoordinate(endPosition);
            this.fillDrawMethod(fill, y0, y1);
        }
    }
    fillDrawMethod(fill, y0, y1) {
        fill.set("draw", (display) => {
            // using for holes, so can not be rectangle
            const w = this.axis.gridContainer.width();
            const h = this.height();
            if (y1 < y0) {
                [y1, y0] = [y0, y1];
            }
            if (y0 > h || y1 < 0) {
                return;
            }
            //y0 = Math.max(0, y0);
            //y1 = Math.min(h, y1);
            display.moveTo(0, y0);
            display.lineTo(w, y0);
            display.lineTo(w, y1);
            display.lineTo(0, y1);
            display.lineTo(0, y0);
        });
    }
    /**
     * Converts relative position (0-1) on axis to a pixel coordinate.
     *
     * @param position  Position (0-1)
     * @return Coordinate (px)
     */
    positionToCoordinate(position) {
        if (!this._inversed) {
            return (this._end - position) * this._axisLength;
        }
        else {
            return (position - this._start) * this._axisLength;
        }
    }
    /**
     * @ignore
     */
    positionTooltip(tooltip, position) {
        this._positionTooltip(tooltip, { x: 0, y: this.positionToCoordinate(position) });
    }
    /**
     * @ignore
     */
    updateTooltipBounds(tooltip) {
        const inside = this.get("inside");
        const num = 100000;
        let global = this._display.toGlobal({ x: 0, y: 0 });
        let y = global.y;
        let x = 0;
        let h = this.axisLength();
        let w = num;
        let pointerOrientation = "right";
        if (this.get("opposite")) {
            if (inside) {
                pointerOrientation = "right";
                x = global.x - num;
                w = num;
            }
            else {
                pointerOrientation = "left";
                x = global.x;
                w = num;
            }
        }
        else {
            if (inside) {
                pointerOrientation = "left";
                x = global.x;
                w = num;
            }
            else {
                pointerOrientation = "right";
                x = global.x - num;
                w = num;
            }
        }
        const bounds = { left: x, right: x + w, top: y, bottom: y + h };
        const oldBounds = tooltip.get("bounds");
        if (!$utils.sameBounds(bounds, oldBounds)) {
            tooltip.set("bounds", bounds);
            tooltip.set("pointerOrientation", pointerOrientation);
        }
    }
    /**
     * @ignore
     */
    _updateLC() {
        const axis = this.axis;
        const parent = axis.parent;
        if (parent) {
            const h = parent.innerHeight();
            this._lc = this.axisLength() / h;
            this._ls = axis.y() / h;
        }
    }
    /**
     * @ignore
     */
    toAxisPosition(position) {
        const start = this._start || 0;
        const end = this._end || 1;
        position -= this._ls;
        position = position * (end - start) / this._lc;
        if (this.get("inversed")) {
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
        if (this.get("inversed")) {
            position = position - start;
        }
        else {
            position = end - position;
        }
        position = position / (end - start) * this._lc;
        position += this._ls;
        return position;
    }
    /**
     * @ignore
     */
    fixPosition(position) {
        if (!this.get("inversed")) {
            return 1 - position;
        }
        return position;
    }
}
Object.defineProperty(AxisRendererY, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "AxisRendererY"
});
Object.defineProperty(AxisRendererY, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: AxisRenderer.classNames.concat([AxisRendererY.className])
});
//# sourceMappingURL=AxisRendererY.js.map