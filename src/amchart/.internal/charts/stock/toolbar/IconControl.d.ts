import type { Percent } from "../../../core/util/Percent";
import { StockControl, IStockControlSettings, IStockControlPrivate, IStockControlEvents } from "./StockControl";
import { DropdownList } from "./DropdownList";
export interface IIcon {
    svgPath: string;
    scale?: number;
    centerX?: Percent;
    centerY?: Percent;
    fillDisabled?: boolean;
}
export interface IIconControlSettings extends IStockControlSettings {
    icons: IIcon[];
}
export interface IIconControlPrivate extends IStockControlPrivate {
    list?: DropdownList;
}
export interface IIconControlEvents extends IStockControlEvents {
    selected: {
        icon: IIcon;
    };
}
/**
 * Shows selection of icons to choose from for annotating [[StockChart]].
 *
 * This class is instantiated automatically, and should not be used standalone.
 */
export declare class IconControl extends StockControl {
    static className: string;
    static classNames: Array<string>;
    _settings: IIconControlSettings;
    _privateSettings: IIconControlPrivate;
    _events: IIconControlEvents;
    protected _afterNew(): void;
    setIcon(icon: IIcon): void;
    protected _initIcons(): void;
    _getDrawingIcon(icon: IIcon): SVGElement;
    _afterChanged(): void;
    protected _dispose(): void;
}
//# sourceMappingURL=IconControl.d.ts.map