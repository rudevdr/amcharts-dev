import { SimpleLineSeries, ISimpleLineSeriesSettings, ISimpleLineSeriesPrivate, ISimpleLineSeriesDataItem } from "./SimpleLineSeries";
export interface IRegressionSeriesDataItem extends ISimpleLineSeriesDataItem {
}
export interface IRegressionSeriesSettings extends ISimpleLineSeriesSettings {
}
export interface IRegressionSeriesPrivate extends ISimpleLineSeriesPrivate {
}
export declare class RegressionSeries extends SimpleLineSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: IRegressionSeriesSettings;
    _privateSettings: IRegressionSeriesPrivate;
    _dataItemSettings: IRegressionSeriesDataItem;
    protected _tag: string;
    protected _afterNew(): void;
    protected _updateSegment(index: number): void;
}
//# sourceMappingURL=RegressionSeries.d.ts.map