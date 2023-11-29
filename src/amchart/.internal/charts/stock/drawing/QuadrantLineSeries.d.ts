import { SimpleLineSeries, ISimpleLineSeriesSettings, ISimpleLineSeriesPrivate, ISimpleLineSeriesDataItem } from "./SimpleLineSeries";
export interface IQuadrantLineSeriesDataItem extends ISimpleLineSeriesDataItem {
}
export interface IQuadrantLineSeriesSettings extends ISimpleLineSeriesSettings {
}
export interface IQuadrantLineSeriesPrivate extends ISimpleLineSeriesPrivate {
}
export declare class QuadrantLineSeries extends SimpleLineSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: IQuadrantLineSeriesSettings;
    _privateSettings: IQuadrantLineSeriesPrivate;
    _dataItemSettings: IQuadrantLineSeriesDataItem;
    protected _tag: string;
    protected _afterNew(): void;
    protected _updateSegment(index: number): void;
    _updateChildren(): void;
    protected _drawFill(): void;
    protected _updateLine(): void;
}
//# sourceMappingURL=QuadrantLineSeries.d.ts.map