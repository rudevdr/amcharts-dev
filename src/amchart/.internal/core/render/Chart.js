import { Container } from "../../core/render/Container";
import { p100 } from "../../core/util/Percent";
/**
 * A base class for all charts.
 */
export class Chart extends Container {
    constructor() {
        super(...arguments);
        /**
         * A [[Container]] chart places its elements in.
         *
         * @default Container.new()
         */
        Object.defineProperty(this, "chartContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Container.new(this._root, { width: p100, height: p100, interactiveChildren: false }))
        });
        /**
         * A [[Container]] chart places its bullets in.
         *
         * @default Container.new()
         */
        Object.defineProperty(this, "bulletsContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Container.new(this._root, { interactiveChildren: false, isMeasured: false, position: "absolute", width: p100, height: p100 })
        });
    }
}
Object.defineProperty(Chart, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Chart"
});
Object.defineProperty(Chart, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Container.classNames.concat([Chart.className])
});
//# sourceMappingURL=Chart.js.map