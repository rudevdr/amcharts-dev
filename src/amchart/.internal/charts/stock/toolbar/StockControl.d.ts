import { Entity, IEntitySettings, IEntityPrivate, IEntityEvents } from "../../../core/util/Entity";
import type { IPointerEvent } from "../../../core/render/backend/Renderer";
import type { StockToolbar } from "./StockToolbar";
import type { StockChart } from "../StockChart";
export interface IStockControlSettings extends IEntitySettings {
    /**
     * A [[StockChart]] the toolbar is for.
     */
    stockChart: StockChart;
    /**
     * Is control visible?
     *
     * @default true
     */
    visible?: boolean;
    /**
     * Name of the control. Used for the label.
     */
    name?: string;
    /**
     * Description of what the button does.
     */
    description?: string;
    /**
     * An element with control icon. If not set, each control will aytomatically
     * create an icon.
     */
    icon?: HTMLElement | SVGElement | "none";
    /**
     * Indicates if control is active.
     *
     * @default false
     */
    active?: boolean;
    /**
     * If set to `true`, control can be toggle on and off by clicking on it.
     *
     * @default true
     */
    togglable?: boolean;
    /**
     * Alignment of the control in a toolbar.
     *
     * @default "left"
     */
    align?: "left" | "right";
}
export interface IStockControlPrivate extends IEntityPrivate {
    toolbar: StockToolbar;
    button?: HTMLDivElement;
    icon?: HTMLElement;
    label?: HTMLDivElement;
}
export interface IStockControlEvents extends IEntityEvents {
    click: {
        originalEvent: IPointerEvent;
    };
}
/**
 * A base class for controls on [[StockToolbar]].
 */
export declare class StockControl extends Entity {
    static className: string;
    static classNames: Array<string>;
    _settings: IStockControlSettings;
    _privateSettings: IStockControlPrivate;
    _events: IStockControlEvents;
    protected _afterNew(): void;
    protected _initElements(): void;
    protected _applyClassNames(): void;
    protected _getIcon(): HTMLElement | SVGElement;
    protected _getDefaultIcon(): SVGElement;
    _beforeChanged(): void;
    protected _dispose(): void;
    protected _setLabel(name: string): void;
    hide(): void;
    show(): void;
    protected _handleClick(): void;
}
//# sourceMappingURL=StockControl.d.ts.map