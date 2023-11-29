import { LineSeries } from "./LineSeries";
import { p100 } from "../../../core/util/Percent";
import { curveStepAfter } from "d3-shape";
export class StepLineSeries extends LineSeries {
    _afterNew() {
        this._setDefault("curveFactory", curveStepAfter);
        super._afterNew();
    }
    _getPoints(dataItem, o) {
        let points = o.points;
        let width = this.get("stepWidth", p100).value / 2;
        let itemLocationX0 = dataItem.get("locationX", o.locationX);
        let itemLocationY0 = dataItem.get("locationY", o.locationY);
        let itemLocationX1 = itemLocationX0;
        let itemLocationY1 = itemLocationY0;
        if (o.baseAxis === o.xAxis) {
            itemLocationX0 -= width;
            itemLocationX1 += width;
        }
        else if (o.baseAxis === o.yAxis) {
            itemLocationY0 -= width;
            itemLocationY1 += width;
        }
        let xPos0 = o.xAxis.getDataItemPositionX(dataItem, o.xField, itemLocationX0, o.vcx);
        let yPos0 = o.yAxis.getDataItemPositionY(dataItem, o.yField, itemLocationY0, o.vcy);
        let xPos1 = o.xAxis.getDataItemPositionX(dataItem, o.xField, itemLocationX1, o.vcx);
        let yPos1 = o.yAxis.getDataItemPositionY(dataItem, o.yField, itemLocationY1, o.vcy);
        if (this._shouldInclude(xPos0)) {
            const iPoint0 = this.getPoint(xPos0, yPos0);
            const point0 = [iPoint0.x, iPoint0.y];
            const iPoint1 = this.getPoint(xPos1, yPos1);
            const point1 = [iPoint1.x, iPoint1.y];
            if (o.fillVisible) {
                let xOpenPos0 = xPos0;
                let yOpenPos0 = yPos0;
                let xOpenPos1 = xPos1;
                let yOpenPos1 = yPos1;
                if (o.baseAxis === o.xAxis) {
                    yOpenPos0 = o.basePosY;
                    yOpenPos1 = o.basePosY;
                }
                else if (o.baseAxis === o.yAxis) {
                    xOpenPos0 = o.basePosX;
                    xOpenPos1 = o.basePosX;
                }
                if (o.getOpen) {
                    let valueX = dataItem.get(o.xOpenField);
                    let valueY = dataItem.get(o.yOpenField);
                    if (valueX != null && valueY != null) {
                        itemLocationX0 = dataItem.get("openLocationX", o.openLocationX);
                        itemLocationY0 = dataItem.get("openLocationY", o.openLocationY);
                        itemLocationX1 = itemLocationX0;
                        itemLocationY1 = itemLocationY0;
                        if (o.baseAxis === o.xAxis) {
                            itemLocationX0 -= width;
                            itemLocationX1 += width;
                        }
                        else if (o.baseAxis === o.yAxis) {
                            itemLocationY0 -= width;
                            itemLocationY1 += width;
                        }
                        if (o.stacked) {
                            let stackToItemX = dataItem.get("stackToItemX");
                            let stackToItemY = dataItem.get("stackToItemY");
                            if (stackToItemX) {
                                xOpenPos0 = o.xAxis.getDataItemPositionX(stackToItemX, o.xField, itemLocationX0, stackToItemX.component.get("vcx"));
                                xOpenPos1 = o.xAxis.getDataItemPositionX(stackToItemX, o.xField, itemLocationX1, stackToItemX.component.get("vcx"));
                            }
                            else {
                                if (o.yAxis === o.baseAxis) {
                                    xOpenPos0 = o.basePosX;
                                    xOpenPos1 = o.basePosX;
                                }
                                else if (o.baseAxis === o.yAxis) {
                                    xOpenPos0 = o.xAxis.getDataItemPositionX(dataItem, o.xOpenField, itemLocationX0, o.vcx);
                                    xOpenPos1 = o.xAxis.getDataItemPositionX(dataItem, o.xOpenField, itemLocationX1, o.vcx);
                                }
                            }
                            if (stackToItemY) {
                                yOpenPos0 = o.yAxis.getDataItemPositionY(stackToItemY, o.yField, itemLocationY0, stackToItemY.component.get("vcy"));
                                yOpenPos1 = o.yAxis.getDataItemPositionY(stackToItemY, o.yField, itemLocationY1, stackToItemY.component.get("vcy"));
                            }
                            else {
                                if (o.xAxis === o.baseAxis) {
                                    yOpenPos0 = o.basePosY;
                                    yOpenPos1 = o.basePosY;
                                }
                                else if (o.baseAxis === o.yAxis) {
                                    yOpenPos0 = o.yAxis.getDataItemPositionY(dataItem, o.yOpenField, itemLocationY0, o.vcy);
                                    yOpenPos1 = o.yAxis.getDataItemPositionY(dataItem, o.yOpenField, itemLocationY1, o.vcy);
                                }
                            }
                        }
                        else {
                            xOpenPos0 = o.xAxis.getDataItemPositionX(dataItem, o.xOpenField, itemLocationX0, o.vcx);
                            yOpenPos0 = o.yAxis.getDataItemPositionY(dataItem, o.yOpenField, itemLocationY0, o.vcy);
                            xOpenPos1 = o.xAxis.getDataItemPositionX(dataItem, o.xOpenField, itemLocationX1, o.vcx);
                            yOpenPos1 = o.yAxis.getDataItemPositionY(dataItem, o.yOpenField, itemLocationY1, o.vcy);
                        }
                    }
                }
                let closeIPoint0 = this.getPoint(xOpenPos0, yOpenPos0);
                let closeIPoint1 = this.getPoint(xOpenPos1, yOpenPos1);
                point0[2] = closeIPoint0.x;
                point0[3] = closeIPoint0.y;
                point1[2] = closeIPoint1.x;
                point1[3] = closeIPoint1.y;
            }
            points.push(point0);
            points.push(point1);
            dataItem.set("point", { x: point0[0] + (point1[0] - point0[0]) / 2, y: point0[1] + (point1[1] - point0[1]) / 2 });
        }
        if (this.get("noRisers")) {
            o.points = [];
            o.segments.push(points);
        }
    }
}
Object.defineProperty(StepLineSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "StepLineSeries"
});
Object.defineProperty(StepLineSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: LineSeries.classNames.concat([StepLineSeries.className])
});
//# sourceMappingURL=StepLineSeries.js.map