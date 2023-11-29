import { SimpleLineSeries, ISimpleLineSeriesSettings, ISimpleLineSeriesPrivate, ISimpleLineSeriesDataItem } from "./SimpleLineSeries";
export interface IAverageSeriesDataItem extends ISimpleLineSeriesDataItem {
}
export interface IAverageSeriesSettings extends ISimpleLineSeriesSettings {
}
export interface IAverageSeriesPrivate extends ISimpleLineSeriesPrivate {
}
export declare class AverageSeries extends SimpleLineSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: IAverageSeriesSettings;
    _privateSettings: IAverageSeriesPrivate;
    _dataItemSettings: IAverageSeriesDataItem;
    protected _tag: string;
    protected _afterNew(): void;
    protected _updateSegment(index: number): void;
}
//# sourceMappingURL=AverageSeries.d.ts.map