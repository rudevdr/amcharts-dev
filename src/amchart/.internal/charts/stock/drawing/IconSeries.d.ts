import type { Percent } from "../../../core/util/Percent";
import type { ISpritePointerEvent } from "../../../core/render/Sprite";
import type { DataItem } from "../../../core/render/Component";
import { PolylineSeries, IPolylineSeriesSettings, IPolylineSeriesPrivate, IPolylineSeriesDataItem } from "./PolylineSeries";
import { SpriteResizer } from "../../../core/render/SpriteResizer";
import { Template } from "../../../core/util/Template";
export interface IIconSeriesDataItem extends IPolylineSeriesDataItem {
    /**
     * An SVG path of the icon.
     */
    svgPath: string;
}
export interface IIconSeriesSettings extends IPolylineSeriesSettings {
    /**
     * @todo review
     */
    iconSvgPath: string;
    /**
     * @todo review
     */
    iconScale?: number;
    /**
     * @todo review
     */
    iconCenterX?: Percent;
    /**
     * @todo review
     */
    iconCenterY?: Percent;
    /**
     * Should icon snap to closest data item?
     */
    snapToData?: boolean;
}
export interface IIconSeriesPrivate extends IPolylineSeriesPrivate {
}
export declare class IconSeries extends PolylineSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: IIconSeriesSettings;
    _privateSettings: IIconSeriesPrivate;
    _dataItemSettings: IIconSeriesDataItem;
    spriteResizer: SpriteResizer;
    protected _tag: string;
    protected _afterNew(): void;
    protected _handlePointerClick(event: ISpritePointerEvent): void;
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _hideAllBullets(): void;
    protected _getIconTemplate(): Template<any>;
    setInteractive(value: boolean): void;
}
//# sourceMappingURL=IconSeries.d.ts.map