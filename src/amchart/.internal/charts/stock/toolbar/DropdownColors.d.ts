import { Color } from "../../../core/util/Color";
import { ColorSet } from "../../../core/util/ColorSet";
import { Dropdown, IDropdownSettings, IDropdownPrivate, IDropdownEvents } from "./Dropdown";
export interface IDropdownColorsSettings extends IDropdownSettings {
    colors?: ColorSet;
    useOpacity?: boolean;
}
export interface IDropdownColorsPrivate extends IDropdownPrivate {
    list?: HTMLUListElement;
    color?: Color;
    opacity?: number;
}
export interface IDropdownColorsEvents extends IDropdownEvents {
    invoked: {
        color: Color;
    };
    invokedOpacity: {
        opacity: number;
    };
}
/**
 * A dropdown used for color picker control.
 *
 * Should not be used as standalone control.
 */
export declare class DropdownColors extends Dropdown {
    static className: string;
    static classNames: Array<string>;
    _settings: IDropdownColorsSettings;
    _privateSettings: IDropdownColorsPrivate;
    _events: IDropdownColorsEvents;
    protected _afterNew(): void;
    protected _initElements(): void;
    protected _initItems(): void;
    _beforeChanged(): void;
    protected _dispose(): void;
    addItem(color: Color): void;
    protected _initOpacity(): void;
}
//# sourceMappingURL=DropdownColors.d.ts.map