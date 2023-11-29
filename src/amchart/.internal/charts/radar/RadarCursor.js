import { XYCursor } from "../xy/XYCursor";
import { p100 } from "../../core/util/Percent";
import { arc } from "d3-shape";
import * as $math from "../../core/util/Math";
import * as $utils from "../../core/util/Utils";
/**
 * Creates a cursor for a [[RadarChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor} for more info
 */
export class RadarCursor extends XYCursor {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_fillGenerator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: arc()
        });
    }
    _afterNew() {
        this._settings.themeTags = $utils.mergeTags(this._settings.themeTags, ["radar", "cursor"]);
        super._afterNew();
    }
    _handleXLine() {
    }
    _handleYLine() {
    }
    _getPosition(point) {
        const radius = Math.hypot(point.x, point.y);
        let angle = $math.normalizeAngle(Math.atan2(point.y, point.x) * $math.DEGREES);
        const innerRadius = this.getPrivate("innerRadius");
        let startAngle = $math.normalizeAngle(this.getPrivate("startAngle"));
        let endAngle = $math.normalizeAngle(this.getPrivate("endAngle"));
        if (endAngle < startAngle || endAngle == startAngle) {
            if (angle < startAngle) {
                angle += 360;
            }
            endAngle = endAngle + 360;
        }
        let xPos = (angle - startAngle) / (endAngle - startAngle);
        if (xPos < 0) {
            xPos = 1 + xPos;
        }
        if (xPos < 0.003) {
            xPos = 0;
        }
        if (xPos > 0.997) {
            xPos = 1;
        }
        return { x: xPos, y: (radius - innerRadius) / (this.getPrivate("radius") - innerRadius) };
    }
    _getPoint(positionX, positionY) {
        const innerRadius = this.getPrivate("innerRadius");
        const startAngle = this.getPrivate("startAngle");
        const endAngle = this.getPrivate("endAngle");
        const radius = this.getPrivate("radius");
        const angle = startAngle + positionX * (endAngle - startAngle);
        const r = innerRadius + (radius - innerRadius) * positionY;
        return { x: r * $math.cos(angle), y: r * $math.sin(angle) };
    }
    /**
     * @ignore
     */
    updateLayout() {
        const chart = this.chart;
        if (chart) {
            const radius = chart.getPrivate("radius", 0);
            this.setPrivate("radius", $utils.relativeToValue(this.get("radius", p100), radius));
            let innerRadius = $utils.relativeToValue(this.get("innerRadius", chart.getPrivate("innerRadius", 0)), radius);
            if (innerRadius < 0) {
                innerRadius = radius + innerRadius;
            }
            this.setPrivate("innerRadius", innerRadius);
            let startAngle = this.get("startAngle", chart.get("startAngle", -90));
            let endAngle = this.get("endAngle", chart.get("endAngle", 270));
            this.setPrivate("startAngle", startAngle);
            this.setPrivate("endAngle", endAngle);
        }
    }
    _updateLines(x, y) {
        if (!this._tooltipX) {
            this._drawXLine(x, y);
        }
        if (!this._tooltipY) {
            this._drawYLine(x, y);
        }
    }
    _drawXLine(x, y) {
        const innerRadius = this.getPrivate("innerRadius");
        const radius = this.getPrivate("radius");
        const angle = Math.atan2(y, x);
        this.lineX.set("draw", (display) => {
            display.moveTo(innerRadius * Math.cos(angle), innerRadius * Math.sin(angle));
            display.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
        });
    }
    _drawYLine(x, y) {
        const positionRadius = Math.hypot(x, y);
        this.lineY.set("draw", (display) => {
            display.arc(0, 0, positionRadius, this.getPrivate("startAngle", 0) * $math.RADIANS, this.getPrivate("endAngle", 0) * $math.RADIANS);
        });
    }
    _updateXLine(tooltip) {
        let point = tooltip.get("pointTo");
        if (point) {
            point = this._display.toLocal(point);
            this._drawXLine(point.x, point.y);
        }
    }
    _updateYLine(tooltip) {
        let point = tooltip.get("pointTo");
        if (point) {
            point = this._display.toLocal(point);
            this._drawYLine(point.x, point.y);
        }
    }
    _inPlot(point) {
        const chart = this.chart;
        if (chart) {
            return chart.inPlot(point, this.getPrivate("radius"), this.getPrivate("innerRadius"));
        }
        return false;
    }
    _updateSelection(point) {
        this.selection.set("draw", (display) => {
            const behavior = this.get("behavior");
            const downPoint = this._downPoint;
            const cursorStartAngle = this.getPrivate("startAngle");
            const cursorEndAngle = this.getPrivate("endAngle");
            let cursorRadius = this.getPrivate("radius");
            let cursorInnerRadius = this.getPrivate("innerRadius");
            if (cursorRadius < cursorInnerRadius) {
                [cursorRadius, cursorInnerRadius] = [cursorInnerRadius, cursorRadius];
            }
            let startAngle = cursorStartAngle;
            let endAngle = cursorEndAngle;
            let radius = cursorRadius;
            let innerRadius = cursorInnerRadius;
            if (downPoint) {
                if (behavior == "zoomXY" || behavior == "selectXY") {
                    startAngle = Math.atan2(downPoint.y, downPoint.x) * $math.DEGREES;
                    endAngle = Math.atan2(point.y, point.x) * $math.DEGREES;
                    innerRadius = Math.hypot(downPoint.x, downPoint.y);
                    radius = Math.hypot(point.x, point.y);
                }
                else if (behavior == "zoomX" || behavior == "selectX") {
                    startAngle = Math.atan2(downPoint.y, downPoint.x) * $math.DEGREES;
                    endAngle = Math.atan2(point.y, point.x) * $math.DEGREES;
                }
                else if (behavior == "zoomY" || behavior == "selectY") {
                    innerRadius = Math.hypot(downPoint.x, downPoint.y);
                    radius = Math.hypot(point.x, point.y);
                }
            }
            innerRadius = $math.fitToRange(innerRadius, cursorInnerRadius, cursorRadius);
            radius = $math.fitToRange(radius, cursorInnerRadius, cursorRadius);
            startAngle = $math.fitAngleToRange(startAngle, cursorStartAngle, cursorEndAngle);
            endAngle = $math.fitAngleToRange(endAngle, cursorStartAngle, cursorEndAngle);
            if (startAngle == endAngle) {
                endAngle = startAngle + 360;
            }
            startAngle *= $math.RADIANS;
            endAngle *= $math.RADIANS;
            this._fillGenerator.context(display);
            this._fillGenerator({ innerRadius: innerRadius, outerRadius: radius, startAngle: startAngle + Math.PI / 2, endAngle: endAngle + Math.PI / 2 });
        });
    }
}
Object.defineProperty(RadarCursor, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "RadarCursor"
});
Object.defineProperty(RadarCursor, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: XYCursor.classNames.concat([RadarCursor.className])
});
//# sourceMappingURL=RadarCursor.js.map