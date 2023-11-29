import { Container } from "../../core/render/Container";
/**
 * Base class for flow chart nodes.
 */
export class FlowNode extends Container {
    constructor() {
        super(...arguments);
        /**
         * Related series.
         */
        Object.defineProperty(this, "series", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
}
Object.defineProperty(FlowNode, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "FlowNode"
});
Object.defineProperty(FlowNode, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Container.classNames.concat([FlowNode.className])
});
//# sourceMappingURL=FlowNode.js.map