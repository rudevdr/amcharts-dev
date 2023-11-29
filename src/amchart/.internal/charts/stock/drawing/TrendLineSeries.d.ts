import { SimpleLineSeries, ISimpleLineSeriesSettings, ISimpleLineSeriesPrivate, ISimpleLineSeriesDataItem } from "./SimpleLineSeries";
export interface ITrendLineSeriesDataItem extends ISimpleLineSeriesDataItem {
}
export interface ITrendLineSeriesSettings extends ISimpleLineSeriesSettings {
}
export interface ITrendLineSeriesPrivate extends ISimpleLineSeriesPrivate {
}
export declare class TrendLineSeries extends SimpleLineSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: ITrendLineSeriesSettings;
    _privateSettings: ITrendLineSeriesPrivate;
    _dataItemSettings: ITrendLineSeriesDataItem;
    protected _tag: string;
    protected _afterNew(): void;
    protected _updateSegment(index: number): void;
}
//# sourceMappingURL=TrendLineSeries.d.ts.map