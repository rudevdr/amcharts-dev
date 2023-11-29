import type { ColorSet } from "../../../core/util/ColorSet";
import type { Color } from "../../../core/util/Color";
import { StockControl, IStockControlSettings, IStockControlPrivate, IStockControlEvents } from "./StockControl";
import { DropdownColors } from "./DropdownColors";
export interface IColorControlSettings extends IStockControlSettings {
    colors?: ColorSet;
    useOpacity?: boolean;
}
export interface IColorControlPrivate extends IStockControlPrivate {
    dropdown?: DropdownColors;
    color?: Color;
    opacity?: number;
}
export interface IColorControlEvents extends IStockControlEvents {
    selected: {
        color: Color;
    };
    selectedOpacity: {
        opacity: number;
    };
}
/**
 * Color picker control.
 */
export declare class ColorControl extends StockControl {
    static className: string;
    static classNames: Array<string>;
    _settings: IColorControlSettings;
    _privateSettings: IColorControlPrivate;
    _events: IColorControlEvents;
    protected _afterNew(): void;
    protected _getDefaultIcon(): SVGElement;
    /**
     * Loads the default CSS.
     *
     * @ignore Exclude from docs
     */
    loadDefaultCSS(): void;
}
//# sourceMappingURL=ColorControl.d.ts.map