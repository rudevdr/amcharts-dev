import { XYSeries } from "./XYSeries";
import { Graphics } from "../../../core/render/Graphics";
import { line, area } from "d3-shape";
import { Template } from "../../../core/util/Template";
import { ListTemplate } from "../../../core/util/List";
import { color } from "../../../core/util/Color";
import { DataItem } from "../../../core/render/Component";
import { Rectangle } from "../../../core/render/Rectangle";
import * as $type from "../../../core/util/Type";
import * as $array from "../../../core/util/Array";
import * as $utils from "../../../core/util/Utils";
/**
 * Used to plot line and/or area series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/line-series/} for more info
 * @important
 */
export class LineSeries extends XYSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_endIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_strokeGenerator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: line()
        });
        Object.defineProperty(this, "_fillGenerator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: area()
        });
        Object.defineProperty(this, "_legendStroke", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_legendFill", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * A [[TemplateList]] of all line segments in series.
         *
         * `strokes.template` can be used to set default settings for all line
         * segments, or to change on existing ones.
         *
         * @default new ListTemplate<Graphics>
         */
        Object.defineProperty(this, "strokes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Graphics._new(this._root, {
                themeTags: $utils.mergeTags(this.strokes.template.get("themeTags", []), ["line", "series", "stroke"])
            }, [this.strokes.template]))
        });
        /**
         * A [[TemplateList]] of all segment fills in series.
         *
         * `fills.template` can be used to set default settings for all segment
         * fills, or to change on existing ones.
         *
         * @default new ListTemplate<Graphics>
         */
        Object.defineProperty(this, "fills", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Graphics._new(this._root, {
                themeTags: $utils.mergeTags(this.strokes.template.get("themeTags", []), ["line", "series", "fill"])
            }, [this.fills.template]))
        });
        // custom set from data
        Object.defineProperty(this, "_fillTemplate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_strokeTemplate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_previousPoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [0, 0, 0, 0]
        });
        Object.defineProperty(this, "_dindex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_sindex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
    }
    _afterNew() {
        this._fillGenerator.y0(function (p) {
            return p[3];
        });
        this._fillGenerator.x0(function (p) {
            return p[2];
        });
        this._fillGenerator.y1(function (p) {
            return p[1];
        });
        this._fillGenerator.x1(function (p) {
            return p[0];
        });
        super._afterNew();
    }
    /**
     * @ignore
     */
    makeStroke(strokes) {
        const stroke = this.mainContainer.children.push(strokes.make());
        strokes.push(stroke);
        return stroke;
    }
    /**
     * @ignore
     */
    makeFill(fills) {
        const fill = this.mainContainer.children.push(fills.make());
        fills.push(fill);
        return fill;
    }
    _updateChildren() {
        this._strokeTemplate = undefined;
        this._fillTemplate = undefined;
        let xAxis = this.get("xAxis");
        let yAxis = this.get("yAxis");
        if (this.isDirty("stroke")) {
            const stroke = this.get("stroke");
            this.strokes.template.set("stroke", stroke);
            const legendStroke = this._legendStroke;
            if (legendStroke) {
                legendStroke.states.lookup("default").set("stroke", stroke);
            }
        }
        if (this.isDirty("fill")) {
            const fill = this.get("fill");
            this.fills.template.set("fill", fill);
            const legendFill = this._legendFill;
            if (legendFill) {
                legendFill.states.lookup("default").set("fill", fill);
            }
        }
        if (this.isDirty("curveFactory")) {
            const curveFactory = this.get("curveFactory");
            if (curveFactory) {
                this._strokeGenerator.curve(curveFactory);
                this._fillGenerator.curve(curveFactory);
            }
        }
        if (xAxis.inited && yAxis.inited) {
            if (this._axesDirty || this._valuesDirty || this._stackDirty || this.isDirty("vcx") || this.isDirty("vcy") || this._sizeDirty || this.isDirty("connect") || this.isDirty("curveFactory")) {
                this.fills.each((fill) => {
                    fill.setPrivate("visible", false);
                });
                this.strokes.each((fill) => {
                    fill.setPrivate("visible", false);
                });
                this.axisRanges.each((axisRange) => {
                    let fills = axisRange.fills;
                    if (fills) {
                        fills.each((fill) => {
                            fill.setPrivate("visible", false);
                        });
                    }
                    let strokes = axisRange.strokes;
                    if (strokes) {
                        strokes.each((stroke) => {
                            stroke.setPrivate("visible", false);
                        });
                    }
                });
                let startIndex = this.startIndex();
                let strokeTemplateField = this.strokes.template.get("templateField");
                let fillTemplateField = this.fills.template.get("templateField");
                let strokeTemplateFound = true;
                let fillTemplateFound = true;
                if (strokeTemplateField) {
                    strokeTemplateFound = false;
                }
                if (fillTemplateField) {
                    fillTemplateFound = false;
                }
                for (let i = startIndex - 1; i >= 0; i--) {
                    let dataItem = this.dataItems[i];
                    let hasValues = true;
                    let dataContext = dataItem.dataContext;
                    if (strokeTemplateField) {
                        if (dataContext[strokeTemplateField]) {
                            strokeTemplateFound = true;
                        }
                    }
                    if (fillTemplateField) {
                        if (dataContext[fillTemplateField]) {
                            fillTemplateFound = true;
                        }
                    }
                    $array.each(this._valueFields, (field) => {
                        if (!$type.isNumber(dataItem.get(field))) {
                            hasValues = false;
                        }
                    });
                    if (hasValues && strokeTemplateFound && fillTemplateFound) {
                        startIndex = i;
                        break;
                    }
                }
                let len = this.dataItems.length;
                let endIndex = this.endIndex();
                if (endIndex < len) {
                    endIndex++;
                    for (let i = endIndex; i < len; i++) {
                        let dataItem = this.dataItems[i];
                        let hasValues = true;
                        $array.each(this._valueFields, (field) => {
                            if (!$type.isNumber(dataItem.get(field))) {
                                hasValues = false;
                            }
                        });
                        if (hasValues) {
                            endIndex = i + 1;
                            break;
                        }
                    }
                }
                if (startIndex > 0) {
                    startIndex--;
                }
                this._endIndex = endIndex;
                this._clearGraphics();
                this._sindex = 0;
                this._dindex = startIndex;
                if (this.dataItems.length == 1) {
                    this._startSegment(0);
                }
                else {
                    // this is done to avoid recursion with a lot of segments 
                    while (this._dindex < endIndex - 1) {
                        this._startSegment(this._dindex);
                        this._sindex++;
                    }
                }
            }
        }
        else {
            this._skipped = true;
        }
        super._updateChildren();
    }
    _clearGraphics() {
        this.strokes.clear();
        this.fills.clear();
    }
    _startSegment(dataItemIndex) {
        let endIndex = this._endIndex;
        let currentEndIndex = endIndex;
        const autoGapCount = this.get("autoGapCount");
        const connect = this.get("connect");
        const fill = this.makeFill(this.fills);
        const fillTemplate = this._fillTemplate;
        const originalTemplate = this.fills.template;
        if (fillTemplate && fillTemplate != originalTemplate) {
            fill.template = fillTemplate;
        }
        fill.setPrivate("visible", true);
        const stroke = this.makeStroke(this.strokes);
        const strokeTemplate = this._strokeTemplate;
        if (strokeTemplate && strokeTemplate != this.strokes.template) {
            stroke.template = strokeTemplate;
        }
        stroke.setPrivate("visible", true);
        let xAxis = this.get("xAxis");
        let yAxis = this.get("yAxis");
        let baseAxis = this.get("baseAxis");
        let vcx = this.get("vcx", 1);
        let vcy = this.get("vcy", 1);
        let xField = this._xField;
        let yField = this._yField;
        let xOpenField = this._xOpenField;
        let yOpenField = this._yOpenField;
        const xOpenFieldValue = this.get("openValueXField");
        const yOpenFieldValue = this.get("openValueYField");
        if (!xOpenFieldValue) {
            xOpenField = this._xField;
        }
        if (!yOpenFieldValue) {
            yOpenField = this._yField;
        }
        const stacked = this.get("stacked");
        const basePosX = xAxis.basePosition();
        const basePosY = yAxis.basePosition();
        let baseField;
        if (baseAxis === yAxis) {
            baseField = this._yField;
        }
        else {
            baseField = this._xField;
        }
        const segments = [];
        let points = [];
        segments.push(points);
        const strokeTemplateField = this.strokes.template.get("templateField");
        const fillTemplateField = this.fills.template.get("templateField");
        let locationX = this.get("locationX", 0.5);
        let locationY = this.get("locationY", 0.5);
        let openLocationX = this.get("openLocationX", locationX);
        let openLocationY = this.get("openLocationY", locationY);
        const minDistance = this.get("minDistance", 0);
        let i;
        let fillVisible = this.fills.template.get("visible");
        if (this.axisRanges.length > 0) {
            fillVisible = true;
        }
        let getOpen = false;
        if (stacked || xOpenFieldValue || yOpenFieldValue) {
            getOpen = true;
        }
        const o = {
            points, segments, stacked, getOpen, basePosX, basePosY, fillVisible, xField, yField, xOpenField, yOpenField, vcx, vcy, baseAxis, xAxis, yAxis, locationX, locationY, openLocationX, openLocationY, minDistance
        };
        for (i = dataItemIndex; i < currentEndIndex; i++) {
            this._dindex = i;
            const dataItem = this._dataItems[i];
            let valueX = dataItem.get(xField);
            let valueY = dataItem.get(yField);
            if (valueX == null || valueY == null) {
                if (!connect) {
                    points = [];
                    segments.push(points);
                    o.points = points;
                }
            }
            else {
                this._getPoints(dataItem, o);
            }
            if (strokeTemplateField) {
                let strokeTemplate = dataItem.dataContext[strokeTemplateField];
                if (strokeTemplate) {
                    if (!(strokeTemplate instanceof Template)) {
                        strokeTemplate = Template.new(strokeTemplate);
                    }
                    this._strokeTemplate = strokeTemplate;
                    if (i > dataItemIndex) {
                        currentEndIndex = i;
                        break;
                    }
                    else {
                        stroke.template = strokeTemplate;
                    }
                }
            }
            if (fillTemplateField) {
                let fillTemplate = dataItem.dataContext[fillTemplateField];
                if (fillTemplate) {
                    if (!(fillTemplate instanceof Template)) {
                        fillTemplate = Template.new(fillTemplate);
                    }
                    this._fillTemplate = fillTemplate;
                    if (i > dataItemIndex) {
                        currentEndIndex = i;
                        break;
                    }
                    else {
                        fill.template = fillTemplate;
                    }
                }
            }
            if (!connect) {
                let nextItem = this.dataItems[i + 1];
                if (nextItem) {
                    if (baseAxis.shouldGap(dataItem, nextItem, autoGapCount, baseField)) {
                        points = [];
                        segments.push(points);
                        o.points = points;
                    }
                }
            }
        }
        fill.setRaw("userData", [dataItemIndex, i]);
        stroke.setRaw("userData", [dataItemIndex, i]);
        if (i === endIndex) {
            this._endLine(points, segments[0][0]);
        }
        if (stroke) {
            this._drawStroke(stroke, segments);
        }
        if (fill) {
            this._drawFill(fill, segments);
        }
        this.axisRanges.each((axisRange) => {
            const container = axisRange.container;
            const fills = axisRange.fills;
            const fill = this.makeFill(fills);
            if (container) {
                container.children.push(fill);
            }
            fill.setPrivate("visible", true);
            this._drawFill(fill, segments);
            const strokes = axisRange.strokes;
            const stroke = this.makeStroke(strokes);
            if (container) {
                container.children.push(stroke);
            }
            stroke.setPrivate("visible", true);
            this._drawStroke(stroke, segments);
            fill.setRaw("userData", [dataItemIndex, i]);
            stroke.setRaw("userData", [dataItemIndex, i]);
        });
    }
    _getPoints(dataItem, o) {
        let points = o.points;
        let itemLocationX = dataItem.get("locationX", o.locationX);
        let itemLocationY = dataItem.get("locationY", o.locationY);
        let xPos = o.xAxis.getDataItemPositionX(dataItem, o.xField, itemLocationX, o.vcx);
        let yPos = o.yAxis.getDataItemPositionY(dataItem, o.yField, itemLocationY, o.vcy);
        if (this._shouldInclude(xPos)) {
            const iPoint = this.getPoint(xPos, yPos);
            const point = [iPoint.x, iPoint.y];
            iPoint.x += this._x;
            iPoint.y += this._y;
            dataItem.set("point", iPoint);
            if (o.fillVisible) {
                let xPos0 = xPos;
                let yPos0 = yPos;
                if (o.baseAxis === o.xAxis) {
                    yPos0 = o.basePosY;
                }
                else if (o.baseAxis === o.yAxis) {
                    xPos0 = o.basePosX;
                }
                if (o.getOpen) {
                    let valueX = dataItem.get(o.xOpenField);
                    let valueY = dataItem.get(o.yOpenField);
                    if (valueX != null && valueY != null) {
                        let itemLocationX = dataItem.get("openLocationX", o.openLocationX);
                        let itemLocationY = dataItem.get("openLocationY", o.openLocationY);
                        if (o.stacked) {
                            let stackToItemX = dataItem.get("stackToItemX");
                            let stackToItemY = dataItem.get("stackToItemY");
                            if (stackToItemX) {
                                xPos0 = o.xAxis.getDataItemPositionX(stackToItemX, o.xField, itemLocationX, stackToItemX.component.get("vcx"));
                                if ($type.isNaN(xPos0)) {
                                    xPos0 = o.basePosX;
                                }
                            }
                            else {
                                if (o.yAxis === o.baseAxis) {
                                    xPos0 = o.basePosX;
                                }
                                else {
                                    xPos0 = o.xAxis.getDataItemPositionX(dataItem, o.xOpenField, itemLocationX, o.vcx);
                                }
                            }
                            if (stackToItemY) {
                                yPos0 = o.yAxis.getDataItemPositionY(stackToItemY, o.yField, itemLocationY, stackToItemY.component.get("vcy"));
                                if ($type.isNaN(yPos0)) {
                                    yPos0 = o.basePosY;
                                }
                            }
                            else {
                                if (o.xAxis === o.baseAxis) {
                                    yPos0 = o.basePosY;
                                }
                                else {
                                    yPos0 = o.yAxis.getDataItemPositionY(dataItem, o.yOpenField, itemLocationY, o.vcy);
                                }
                            }
                        }
                        else {
                            xPos0 = o.xAxis.getDataItemPositionX(dataItem, o.xOpenField, itemLocationX, o.vcx);
                            yPos0 = o.yAxis.getDataItemPositionY(dataItem, o.yOpenField, itemLocationY, o.vcy);
                        }
                    }
                }
                let closeIPoint = this.getPoint(xPos0, yPos0);
                point[2] = closeIPoint.x;
                point[3] = closeIPoint.y;
            }
            if (o.minDistance > 0) {
                const p0 = point[0];
                const p1 = point[1];
                const p2 = point[2];
                const p3 = point[3];
                const prev = this._previousPoint;
                const pp0 = prev[0];
                const pp1 = prev[1];
                const pp2 = prev[2];
                const pp3 = prev[3];
                if (Math.hypot(p0 - pp0, p1 - pp1) > o.minDistance || (p2 && p3 && Math.hypot(p2 - pp2, p3 - pp3) > o.minDistance)) {
                    points.push(point);
                    this._previousPoint = point;
                }
            }
            else {
                points.push(point);
            }
        }
    }
    _endLine(_points, _firstPoint) {
    }
    _drawStroke(graphics, segments) {
        if (graphics.get("visible") && !graphics.get("forceHidden")) {
            graphics.set("draw", (display) => {
                $array.each(segments, (segment) => {
                    this._strokeGenerator.context(display);
                    this._strokeGenerator(segment);
                });
            });
        }
    }
    _drawFill(graphics, segments) {
        if (graphics.get("visible") && !graphics.get("forceHidden")) {
            graphics.set("draw", (display) => {
                $array.each(segments, (segment) => {
                    this._fillGenerator.context(display);
                    this._fillGenerator(segment);
                });
            });
        }
    }
    _processAxisRange(axisRange) {
        super._processAxisRange(axisRange);
        axisRange.fills = new ListTemplate(Template.new({}), () => Graphics._new(this._root, {
            themeTags: $utils.mergeTags(axisRange.fills.template.get("themeTags", []), ["line", "series", "fill"]),
        }, [this.fills.template, axisRange.fills.template]));
        axisRange.strokes = new ListTemplate(Template.new({}), () => Graphics._new(this._root, {
            themeTags: $utils.mergeTags(axisRange.strokes.template.get("themeTags", []), ["line", "series", "stroke"]),
        }, [this.strokes.template, axisRange.strokes.template]));
    }
    /**
     * @ignore
     */
    createLegendMarker(_dataItem) {
        const legendDataItem = this.get("legendDataItem");
        if (legendDataItem) {
            const marker = legendDataItem.get("marker");
            const markerRectangle = legendDataItem.get("markerRectangle");
            if (markerRectangle) {
                markerRectangle.setPrivate("visible", false);
            }
            marker.set("background", Rectangle.new(marker._root, { fillOpacity: 0, fill: color(0x000000) }));
            const legendStroke = marker.children.push(Graphics._new(marker._root, {
                themeTags: ["line", "series", "legend", "marker", "stroke"], interactive: false
            }, [this.strokes.template]));
            this._legendStroke = legendStroke;
            const legendFill = marker.children.push(Graphics._new(marker._root, {
                themeTags: ["line", "series", "legend", "marker", "fill"]
            }, [this.fills.template]));
            this._legendFill = legendFill;
            const disabledColor = this._root.interfaceColors.get("disabled");
            legendStroke.states.create("disabled", { fill: disabledColor, stroke: disabledColor });
            legendFill.states.create("disabled", { fill: disabledColor, stroke: disabledColor });
            if (this.bullets.length > 0) {
                const bulletFunction = this.bullets.getIndex(0);
                if (bulletFunction) {
                    const bullet = bulletFunction(marker._root, this, new DataItem(this, { legend: true }, {}));
                    if (bullet) {
                        const sprite = bullet.get("sprite");
                        if (sprite instanceof Graphics) {
                            sprite.states.create("disabled", { fill: disabledColor, stroke: disabledColor });
                        }
                        if (sprite) {
                            sprite.set("tooltipText", undefined);
                            sprite.set("tooltipHTML", undefined);
                            marker.children.push(sprite);
                            sprite.setAll({ x: marker.width() / 2, y: marker.height() / 2 });
                            marker.events.on("boundschanged", () => {
                                sprite.setAll({ x: marker.width() / 2, y: marker.height() / 2 });
                            });
                        }
                    }
                }
            }
        }
    }
}
Object.defineProperty(LineSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "LineSeries"
});
Object.defineProperty(LineSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: XYSeries.classNames.concat([LineSeries.className])
});
//# sourceMappingURL=LineSeries.js.map