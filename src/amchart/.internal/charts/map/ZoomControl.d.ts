import type { MapChart } from "./MapChart";
import { Container, IContainerPrivate, IContainerSettings } from "../../core/render/Container";
import { Button } from "../../core/render/Button";
import { MultiDisposer } from "../../core/util/Disposer";
export interface IZoomControlSettings extends IContainerSettings {
}
export interface IZoomControlPrivate extends IContainerPrivate {
    /**
     * @ignore
     */
    chart?: MapChart;
}
/**
 * A control that displays button for zooming [[MapChart]] in and out.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Zoom_control} for more information
 * @important
 */
export declare class ZoomControl extends Container {
    /**
     * A [[Button]] for zoom in.
     *
     * @default Button.new()
     */
    readonly plusButton: Button;
    /**
     * A [[Button]] for zoom out.
     *
     * @default Button.new()
     */
    readonly minusButton: Button;
    _settings: IZoomControlSettings;
    _privateSettings: IZoomControlPrivate;
    static className: string;
    static classNames: Array<string>;
    protected _disposer: MultiDisposer | undefined;
    protected _afterNew(): void;
    _prepareChildren(): void;
}
//# sourceMappingURL=ZoomControl.d.ts.map