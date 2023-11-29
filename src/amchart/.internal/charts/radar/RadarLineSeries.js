import { LineSeries } from "../xy/series/LineSeries";
import { Graphics } from "../../core/render/Graphics";
import * as $math from "../../core/util/Math";
/**
 * Draws a line series for use in a [[RadarChart]].
 *
 * @important
 */
export class RadarLineSeries extends LineSeries {
    _afterNew() {
        super._afterNew();
        this.set("maskContent", false);
        this.bulletsContainer.set("maskContent", false);
        this.bulletsContainer.set("mask", Graphics.new(this._root, {}));
    }
    _handleMaskBullets() {
    }
    getPoint(positionX, positionY) {
        const yAxis = this.get("yAxis");
        const xAxis = this.get("xAxis");
        const rendererY = yAxis.get("renderer");
        const radius = rendererY.positionToCoordinate(positionY) + rendererY.getPrivate("innerRadius", 0);
        const rendererX = xAxis.get("renderer");
        const angle = rendererX.positionToAngle(positionX);
        return { x: radius * $math.cos(angle), y: radius * $math.sin(angle) };
    }
    _endLine(points, firstPoint) {
        if (this.get("connectEnds") && firstPoint) {
            points.push(firstPoint);
        }
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
            let dataItem = sprite.dataItem;
            let locationX = bullet.get("locationX", dataItem.get("locationX", 0.5));
            let locationY = bullet.get("locationY", dataItem.get("locationY", 0.5));
            let xAxis = this.get("xAxis");
            let yAxis = this.get("yAxis");
            //let baseAxis = this.get("baseAxis");
            //if(xAxis == baseAxis){
            //locationY = 1;
            //}
            //else if(yAxis == baseAxis){
            //locationX = 1;
            //}
            const positionX = xAxis.getDataItemPositionX(dataItem, this._xField, locationX, this.get("vcx", 1));
            const positionY = yAxis.getDataItemPositionY(dataItem, this._yField, locationY, this.get("vcy", 1));
            let point = this.getPoint(positionX, positionY);
            if (this._shouldShowBullet(positionX, positionY)) {
                sprite.setPrivate("visible", true);
                sprite.set("x", point.x);
                sprite.set("y", point.y);
            }
            else {
                sprite.setPrivate("visible", false);
            }
        }
    }
}
Object.defineProperty(RadarLineSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "RadarLineSeries"
});
Object.defineProperty(RadarLineSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: LineSeries.classNames.concat([RadarLineSeries.className])
});
//# sourceMappingURL=RadarLineSeries.js.map