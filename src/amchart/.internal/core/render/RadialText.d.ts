import { Text, ITextSettings, ITextPrivate } from "./Text";
import type { IRadialText } from "./backend/Renderer";
/**
 * @ignore
 */
export interface IRadialTextSettings extends ITextSettings {
    textType?: "regular" | "circular" | "radial" | "aligned" | "adjusted";
    radius?: number;
    startAngle?: number;
    inside?: boolean;
    orientation?: "inward" | "outward" | "auto";
    kerning?: number;
}
/**
 * @ignore
 */
export interface IRadialTextPrivate extends ITextPrivate {
}
/**
 * @ignore
 */
export declare class RadialText extends Text {
    _settings: IRadialTextSettings;
    _privateSettings: IRadialTextPrivate;
    _display: IRadialText;
    protected _afterNew(): void;
    static className: string;
    static classNames: Array<string>;
    _beforeChanged(): void;
}
//# sourceMappingURL=RadialText.d.ts.map