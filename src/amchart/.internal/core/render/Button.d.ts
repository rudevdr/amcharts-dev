import type { Label } from "../render/Label";
import type { Graphics } from "../render/Graphics";
import { Container, IContainerPrivate, IContainerSettings } from "./Container";
export interface IButtonSettings extends IContainerSettings {
    /**
     * A [[Label]] element for the button to show as a label.
     */
    label?: Label;
    /**
     * A [[Graphics]] element for the button to show as icon.
     */
    icon?: Graphics;
}
export interface IButtonPrivate extends IContainerPrivate {
}
/**
 * Draws an interactive button.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/buttons/} for more info
 * @important
 */
export declare class Button extends Container {
    protected _afterNew(): void;
    _settings: IButtonSettings;
    _privateSettings: IButtonPrivate;
    static className: string;
    static classNames: Array<string>;
    _prepareChildren(): void;
}
//# sourceMappingURL=Button.d.ts.map