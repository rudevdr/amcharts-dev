import { Graphics, IGraphicsSettings, IGraphicsPrivate } from "../../core/render/Graphics";
import type { IPoint } from "../../core/util/IPoint";
export interface IFunnelSliceSettings extends IGraphicsSettings {
    /**
     * Top width in pixels.
     */
    topWidth?: number;
    /**
     * Bottom width in pixels.
     */
    bottomWidth?: number;
    /**
     * Orientation.
     */
    orientation?: "vertical" | "horizontal";
    /**
     * A distance in pixels the slice should "puff up".
     *
     * Any non-zero value will make sides of the slide curved.
     */
    expandDistance?: number;
}
export interface IFunnelSlicePrivate extends IGraphicsPrivate {
}
/**
 * Draws a slice for [[FunnelSeries]].
 */
export declare class FunnelSlice extends Graphics {
    _settings: IFunnelSliceSettings;
    _privateSettings: IFunnelSlicePrivate;
    static className: string;
    static classNames: Array<string>;
    protected _projectionDirty: boolean;
    protected _tlx: number;
    protected _tly: number;
    protected _trx: number;
    protected _try: number;
    protected _blx: number;
    protected _bly: number;
    protected _brx: number;
    protected _bry: number;
    protected _cprx: number;
    protected _cplx: number;
    protected _cpry: number;
    protected _cply: number;
    protected _afterNew(): void;
    getPoint(locationX: number, locationY: number): IPoint;
    _changed(): void;
}
//# sourceMappingURL=FunnelSlice.d.ts.map