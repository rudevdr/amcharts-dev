import type { Label } from "../../../core/render/Label";
import type { Container } from "../../../core/render/Container";
import { LabelSeries, ILabelSeriesSettings, ILabelSeriesPrivate, ILabelSeriesDataItem } from "./LabelSeries";
import type { DataItem } from "../../../core/render/Component";
import { Template } from "../../../core/util/Template";
export interface ICalloutSeriesDataItem extends ILabelSeriesDataItem {
}
export interface ICalloutSeriesSettings extends ILabelSeriesSettings {
}
export interface ICalloutSeriesPrivate extends ILabelSeriesPrivate {
}
export declare class CalloutSeries extends LabelSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: ICalloutSeriesSettings;
    _privateSettings: ICalloutSeriesPrivate;
    _dataItemSettings: ICalloutSeriesDataItem;
    protected _tag: string;
    protected _tweakBullet2(label: Label, dataItem: DataItem<ICalloutSeriesDataItem>): void;
    protected _tweakBullet(container: Container, dataItem: DataItem<ICalloutSeriesDataItem>): void;
    protected _updatePointer(label: Label): void;
    protected _afterTextSave(dataContext: any): void;
    protected _hideAllBullets(): void;
    protected _getBgTemplate(): Template<any>;
}
//# sourceMappingURL=CalloutSeries.d.ts.map