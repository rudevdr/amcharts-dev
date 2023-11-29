import { Scrollbar, IScrollbarPrivate, IScrollbarSettings } from "../../core/render/Scrollbar";
import { XYChart } from "./XYChart";
import { Graphics } from "../../core/render/Graphics";
export interface IXYChartScrollbarSettings extends IScrollbarSettings {
}
export interface IXYChartScrollbarPrivate extends IScrollbarPrivate {
}
/**
 * Creates a scrollbar with chart preview in it.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/#Scrollbar_with_chart_preview} for more info
 * @important
 */
export declare class XYChartScrollbar extends Scrollbar {
    _settings: IXYChartScrollbarSettings;
    _privateSettings: IXYChartScrollbarPrivate;
    static className: string;
    static classNames: Array<string>;
    /**
     * An instance of an [[XYChart]] that is used to plot chart preview in
     * scrollbar.
     */
    readonly chart: XYChart;
    /**
     * A graphics element that is displayed over inactive portion of the
     * scrollbarpreview, to dim it down.
     */
    readonly overlay: Graphics;
    protected _afterNew(): void;
    protected _updateThumb(): void;
}
//# sourceMappingURL=XYChartScrollbar.d.ts.map