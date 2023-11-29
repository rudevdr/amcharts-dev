import { Scrollbar, IScrollbarPrivate, IScrollbarSettings, IScrollbarEvents } from "./Scrollbar";
export interface ISliderSettings extends IScrollbarSettings {
}
export interface ISliderPrivate extends IScrollbarPrivate {
}
export interface ISliderEvents extends IScrollbarEvents {
}
/**
 * A control that allows zooming chart's axes, or other uses requiring range
 * selection.
 */
export declare class Slider extends Scrollbar {
    _settings: ISliderSettings;
    _privateSettings: ISliderPrivate;
    _events: ISliderEvents;
    static className: string;
    static classNames: Array<string>;
    protected _afterNew(): void;
    /**
     * @ignore
     */
    updateGrips(): void;
}
//# sourceMappingURL=Slider.d.ts.map