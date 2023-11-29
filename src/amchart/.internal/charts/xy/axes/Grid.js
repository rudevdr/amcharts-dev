import { Graphics } from "../../../core/render/Graphics";
/**
 * Creates an axis grid line.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Grid} for more info
 * @important
 */
export class Grid extends Graphics {
    _beforeChanged() {
        super._beforeChanged();
        if (this.isPrivateDirty("width") || this.isPrivateDirty("height")) {
            this._clear = true;
        }
    }
}
Object.defineProperty(Grid, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Grid"
});
Object.defineProperty(Grid, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Graphics.classNames.concat([Grid.className])
});
//# sourceMappingURL=Grid.js.map