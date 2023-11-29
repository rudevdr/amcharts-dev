import { RoundedRectangle } from "../../../core/render/RoundedRectangle";
/**
 * A candle element used in a [[CandlestickSeries]].
 */
export class Candlestick extends RoundedRectangle {
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("lowX0") || this.isDirty("lowY0") || this.isDirty("lowX1") || this.isDirty("lowY1") || this.isDirty("highX0") || this.isDirty("highX1") || this.isDirty("highY0") || this.isDirty("highY1")) {
            this._clear = true;
        }
    }
    _draw() {
        super._draw();
        const display = this._display;
        display.moveTo(this.get("lowX0", 0), this.get("lowY0", 0));
        display.lineTo(this.get("lowX1", 0), this.get("lowY1", 0));
        display.moveTo(this.get("highX0", 0), this.get("highY0", 0));
        display.lineTo(this.get("highX1", 0), this.get("highY1", 0));
    }
}
Object.defineProperty(Candlestick, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Candlestick"
});
Object.defineProperty(Candlestick, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: RoundedRectangle.classNames.concat([Candlestick.className])
});
//# sourceMappingURL=Candlestick.js.map