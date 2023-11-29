import { Line } from "./Line";
/**
 * Draws a tick element (mostly used on axes).
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 */
export class Tick extends Line {
}
Object.defineProperty(Tick, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Tick"
});
Object.defineProperty(Tick, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Line.classNames.concat([Tick.className])
});
//# sourceMappingURL=Tick.js.map