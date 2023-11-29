/** @ignore */ /** */
import type { IDisposer } from "./Disposer";
/**
 * @ignore
 */
interface Sensor {
    addTarget(target: Element, callback: () => void): void;
    removeTarget(target: Element): void;
}
/**
 * @ignore
 */
export declare class ResizeSensor implements IDisposer {
    private _sensor;
    private _element;
    private _listener;
    private _disposed;
    constructor(element: Element, callback: () => void);
    isDisposed(): boolean;
    dispose(): void;
    get sensor(): Sensor;
}
export {};
//# sourceMappingURL=ResizeSensor.d.ts.map