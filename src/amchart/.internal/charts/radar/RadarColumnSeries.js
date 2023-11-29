import { BaseColumnSeries } from "../xy/series/BaseColumnSeries";
import { Slice } from "../../core/render/Slice";
import { Graphics } from "../../core/render/Graphics";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import * as $math from "../../core/util/Math";
import * as $utils from "../../core/util/Utils";
/**
 * A column series for use in a [[RadarChart]].
 *
 * @important
 */
export class RadarColumnSeries extends BaseColumnSeries {
    constructor() {
        super(...arguments);
        /**
         * A [[TemplateList]] of all columns in series.
         *
         * `columns.template` can be used to set default settings for all columns,
         * or to change on existing ones.
         *
         * @default new ListTemplate<Slice>
         */
        Object.defineProperty(this, "columns", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Slice._new(this._root, {
                position: "absolute",
                themeTags: $utils.mergeTags(this.columns.template.get("themeTags", []), ["radar", "series", "column"])
            }, [this.columns.template]))
        });
    }
    /**
     * @ignore
     */
    makeColumn(dataItem, listTemplate) {
        const column = this.mainContainer.children.push(listTemplate.make());
        column._setDataItem(dataItem);
        listTemplate.push(column);
        return column;
    }
    _afterNew() {
        super._afterNew();
        this.set("maskContent", false);
        this.bulletsContainer.set("maskContent", false);
        this.bulletsContainer.set("mask", Graphics.new(this._root, {}));
    }
    /**
     * @ignore
     */
    getPoint(positionX, positionY) {
        const yAxis = this.get("yAxis");
        const xAxis = this.get("xAxis");
        const rendererY = xAxis.get("renderer");
        const radius = yAxis.get("renderer").positionToCoordinate(positionY) + rendererY.getPrivate("innerRadius", 0);
        const rendererX = xAxis.get("renderer");
        const angle = rendererX.positionToAngle(positionX);
        return { x: radius * $math.cos(angle), y: radius * $math.sin(angle) };
    }
    _updateSeriesGraphics(dataItem, graphics, l, r, t, b) {
        graphics.setPrivate("visible", true);
        const xAxis = this.get("xAxis");
        const yAxis = this.get("yAxis");
        const rendererX = xAxis.get("renderer");
        const rendererY = yAxis.get("renderer");
        const axisInnerRadius = rendererY.getPrivate("innerRadius", 0);
        const startAngle = rendererX.fitAngle(rendererX.positionToAngle(l));
        const endAngle = rendererX.fitAngle(rendererX.positionToAngle(r));
        let innerRadius = rendererY.positionToCoordinate(b) + axisInnerRadius;
        let radius = rendererY.positionToCoordinate(t) + axisInnerRadius;
        const slice = graphics;
        dataItem.setRaw("startAngle", startAngle);
        dataItem.setRaw("endAngle", endAngle);
        dataItem.setRaw("innerRadius", innerRadius);
        dataItem.setRaw("radius", radius);
        let axisStartAngle = 0;
        let axisEndAngle = 360;
        if (yAxis == this.get("baseAxis")) {
            axisStartAngle = rendererY.getPrivate("startAngle", 0);
            axisEndAngle = rendererY.getPrivate("endAngle", 360);
        }
        else {
            axisStartAngle = rendererX.getPrivate("startAngle", 0);
            axisEndAngle = rendererX.getPrivate("endAngle", 360);
        }
        if (axisStartAngle > axisEndAngle) {
            [axisStartAngle, axisEndAngle] = [axisEndAngle, axisStartAngle];
        }
        if ((endAngle <= axisStartAngle) || (startAngle >= axisEndAngle) || (radius <= axisInnerRadius && innerRadius <= axisInnerRadius)) {
            slice.setPrivate("visible", false);
        }
        slice.setAll({ innerRadius, radius, startAngle, arc: endAngle - startAngle });
    }
    _shouldInclude(position) {
        const xAxis = this.get("xAxis");
        if (position < xAxis.get("start") || position > xAxis.get("end")) {
            return false;
        }
        return true;
    }
    _shouldShowBullet(positionX, _positionY) {
        const xAxis = this.get("xAxis");
        if (positionX < xAxis.get("start") || positionX > xAxis.get("end")) {
            return false;
        }
        return this._showBullets;
    }
    _positionBullet(bullet) {
        let sprite = bullet.get("sprite");
        if (sprite) {
            const dataItem = sprite.dataItem;
            const locationX = bullet.get("locationX", dataItem.get("locationX", 0.5));
            const locationY = bullet.get("locationY", dataItem.get("locationY", 0.5));
            const series = dataItem.component;
            const xAxis = series.get("xAxis");
            const yAxis = series.get("yAxis");
            const positionX = xAxis.getDataItemPositionX(dataItem, series._xField, locationX, series.get("vcx", 1));
            const positionY = yAxis.getDataItemPositionY(dataItem, series._yField, locationY, series.get("vcy", 1));
            const startAngle = dataItem.get("startAngle", 0);
            const endAngle = dataItem.get("endAngle", 0);
            const radius = dataItem.get("radius", 0);
            const innerRadius = dataItem.get("innerRadius", 0);
            if (series._shouldShowBullet(positionX, positionY)) {
                sprite.setPrivate("visible", true);
                const angle = startAngle + (endAngle - startAngle) * locationX;
                const r = innerRadius + (radius - innerRadius) * locationY;
                sprite.set("x", $math.cos(angle) * r);
                sprite.set("y", $math.sin(angle) * r);
            }
            else {
                sprite.setPrivate("visible", false);
            }
        }
    }
    _handleMaskBullets() {
    }
    _processAxisRange(axisRange) {
        super._processAxisRange(axisRange);
        axisRange.columns = new ListTemplate(Template.new({}), () => Slice._new(this._root, {
            position: "absolute",
            themeTags: $utils.mergeTags(axisRange.columns.template.get("themeTags", []), ["radar", "series", "column"]),
        }, [this.columns.template, axisRange.columns.template]));
    }
}
Object.defineProperty(RadarColumnSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "RadarColumnSeries"
});
Object.defineProperty(RadarColumnSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: BaseColumnSeries.classNames.concat([RadarColumnSeries.className])
});
//# sourceMappingURL=RadarColumnSeries.js.map