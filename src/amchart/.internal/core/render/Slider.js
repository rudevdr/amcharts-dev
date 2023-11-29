import { Scrollbar } from "./Scrollbar";
/**
 * A control that allows zooming chart's axes, or other uses requiring range
 * selection.
 */
export class Slider extends Scrollbar {
    _afterNew() {
        this._addOrientationClass();
        super._afterNew();
        this.endGrip.setPrivate("visible", false);
        this.thumb.setPrivate("visible", false);
    }
    /**
     * @ignore
     */
    updateGrips() {
        super.updateGrips();
        const startGrip = this.startGrip;
        this.endGrip.setAll({ x: startGrip.x(), y: startGrip.y() });
        this.setRaw("end", this.get("start"));
    }
}
Object.defineProperty(Slider, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Slider"
});
Object.defineProperty(Slider, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Scrollbar.classNames.concat([Slider.className])
});
//# sourceMappingURL=Slider.js.map