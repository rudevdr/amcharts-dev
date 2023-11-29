import type { TimeUnit } from "../../../core/util/Time";
import type { DateAxis } from "../../xy/axes/DateAxis";
import type { AxisRenderer } from "../../xy/axes/AxisRenderer";
import { StockControl, IStockControlSettings, IStockControlPrivate, IStockControlEvents } from "./StockControl";
import { IDisposer } from "../../../core/util/Disposer";
export interface IPeriod {
    timeUnit: TimeUnit | "ytd" | "max" | "custom";
    count?: number;
    name?: string;
    start?: Date;
    end?: Date;
}
export interface IPeriodSelectorSettings extends IStockControlSettings {
    /**
     * A list periods to choose from.
     */
    periods?: IPeriod[];
    /**
     * Hide periods that are longer than the actual data.
     *
     * @default false
     * @since 5.3.9
     */
    hideLongPeriods?: boolean;
    /**
     * Indicates whether to select periods from the start or end of the axis
     * scale.
     *
     * @default "end"
     * @since 5.5.0
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/period-selector/#Zoom_anchor_point} for more info
     */
    zoomTo?: "end" | "start";
}
export interface IPeriodSelectorPrivate extends IStockControlPrivate {
    /**
     * @ignore
     */
    axis?: DateAxis<AxisRenderer>;
    /**
     * @ignore
     */
    deferReset?: boolean;
    /**
     * @ignore
     */
    deferTimeout?: IDisposer;
}
export interface IPeriodSelectorEvents extends IStockControlEvents {
}
/**
 * A pre-defined period selector control for [[StockToolback]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/period-selector/} for more info
 */
export declare class PeriodSelector extends StockControl {
    static className: string;
    static classNames: Array<string>;
    _settings: IPeriodSelectorSettings;
    _privateSettings: IPeriodSelectorPrivate;
    _events: IPeriodSelectorEvents;
    protected _groupChangedDp: IDisposer | undefined;
    protected _groupChangedTo: IDisposer | undefined;
    protected _afterNew(): void;
    protected _initPeriodButtons(): void;
    protected _resetActiveButtons(): void;
    protected _setPeriodButtonStatus(): void;
    _afterChanged(): void;
    protected _getChart(): any;
    protected _getAxis(): any;
    selectPeriod(period: IPeriod): void;
    protected _highlightPeriod(period: IPeriod): void;
}
//# sourceMappingURL=PeriodSelector.d.ts.map