import { LineSeries, ILineSeriesSettings, ILineSeriesPrivate, ILineSeriesDataItem } from "./LineSeries";
import type { AxisRenderer } from "../axes/AxisRenderer";
import type { Axis } from "../axes/Axis";
import { Percent } from "../../../core/util/Percent";
import type { DataItem } from "../../../core/render/Component";
export interface IStepLineSeriesDataItem extends ILineSeriesDataItem {
}
export interface IStepLineSeriesSettings extends ILineSeriesSettings {
    /**
     * Width of the step in percent relative to the cell width.
     *
     * NOTE: setting this to less than 100% makes sense only when risers are
     * disabled: `noRisers: true`
     *
     * @default 100%
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/step-line-series/#Step_width} for more info
     */
    stepWidth?: Percent;
    /**
     * Disables vertical connecting lines for the steps.
     *
     * @default false
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/step-line-series/#Disabling_risers} for more info
     */
    noRisers?: boolean;
}
export interface IStepLineSeriesPrivate extends ILineSeriesPrivate {
}
export declare class StepLineSeries extends LineSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: IStepLineSeriesSettings;
    _privateSettings: IStepLineSeriesPrivate;
    _dataItemSettings: IStepLineSeriesDataItem;
    protected _afterNew(): void;
    protected _getPoints(dataItem: DataItem<this["_dataItemSettings"]>, o: {
        points: Array<Array<number>>;
        segments: number[][][];
        stacked: boolean | undefined;
        getOpen: boolean;
        basePosX: number;
        basePosY: number;
        fillVisible: boolean | undefined;
        xField: string;
        yField: string;
        xOpenField: string;
        yOpenField: string;
        vcx: number;
        vcy: number;
        baseAxis: Axis<AxisRenderer>;
        xAxis: Axis<AxisRenderer>;
        yAxis: Axis<AxisRenderer>;
        locationX: number;
        locationY: number;
        openLocationX: number;
        openLocationY: number;
    }): void;
}
//# sourceMappingURL=StepLineSeries.d.ts.map