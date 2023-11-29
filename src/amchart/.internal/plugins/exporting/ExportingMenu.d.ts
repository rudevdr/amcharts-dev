import type { Exporting, ExportingFormats, ExportingTypes } from "./Exporting";
import { Entity, IEntitySettings, IEntityPrivate, IEntityEvents } from "../../core/util/Entity";
export interface IExportingMenuItem {
    /**
     * Indicates type of the menu item:
     * * `"format"` - indicates export action
     * * `"separator"` - will show horizontal divider.
     * * `"custom"` - will invoke custom function when clicked.
     */
    type: "format" | "separator" | "custom";
    /**
     * If `type` is set to `"format"`, clicking item will initiate export in
     * that format.
     */
    format?: ExportingFormats;
    /**
     * Indicates export type: `"image"`, `"data"`, or `"print"`.
     */
    exportType?: ExportingTypes;
    /**
     * Menu label.
     */
    label?: string;
    /**
     * Additional information.
     */
    sublabel?: string;
    /**
     * If `type` is set to `"custom"`, this needs to be set to a function.
     */
    callback?: (menuItem?: any) => any;
    /**
     * A target for callback function.
     */
    callbackTarget?: any;
    /**
     * A DOM element for the menu item.
     *
     * @readonly
     */
    element?: HTMLAnchorElement;
}
export interface IExportingMenuSettings extends IEntitySettings {
    /**
     * Horizontal alignment of the menu.
     *
     * @default "right"
     */
    align?: "left" | "right";
    /**
     * Vertical alignment of the menu.
     *
     * @default "top"
     */
    valign?: "top" | "bottom";
    /**
     * A reference to an element in the document to place export menu in.
     *
     * If not set, will use root element's container.
     */
    container?: HTMLElement;
    /**
     * A list of menu items.
     */
    items?: IExportingMenuItem[];
    /**
     * A reference to related [[Exporting]] object.
     */
    exporting?: Exporting;
    /**
     * If set to `false` the legend will not load default CSS.
     *
     * @default true
     */
    useDefaultCSS?: boolean;
    /**
     * If set to `true` the menu will close automatically when export operation
     * is initiated.
     *
     * @default true
     */
    autoClose?: boolean;
    /**
     * Menu will disable all interactions for the underlying chart when browsing
     * the menu.
     *
     * @default true
     */
    deactivateRoot?: boolean;
}
export interface IExportingMenuPrivate extends IEntityPrivate {
    /**
     * A `<div>` element that acts as a container for other menu elements.
     */
    menuElement?: HTMLDivElement;
    /**
     * A top-level `<ul>` element containing menu items.
     */
    listElement?: HTMLUListElement;
}
export interface IExportingMenuEvents extends IEntityEvents {
    "menucreated": {};
    "menuopened": {};
    "menuclosed": {};
}
/**
 * Displays a menu for [[Exporting]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/exporting/} for more info
 */
export declare class ExportingMenu extends Entity {
    static className: string;
    static classNames: Array<string>;
    _settings: IExportingMenuSettings;
    _privateSettings: IExportingMenuPrivate;
    _events: IExportingMenuEvents;
    private _menuElement?;
    private _iconElement?;
    private _listElement?;
    private _itemElements?;
    private _itemDisposers;
    private _cssDisposer?;
    private _activeItem?;
    isOpen: boolean;
    private _isOver;
    protected _afterNew(): void;
    _afterChanged(): void;
    protected _dispose(): void;
    private _applyClassNames;
    /**
     * @ignore
     */
    createItems(): void;
    private _handleClick;
    private _handleItemFocus;
    private _handleItemBlur;
    /**
     * Loads the default CSS.
     *
     * @ignore Exclude from docs
     */
    loadDefaultCSS(): void;
    /**
     * Opens menu.
     */
    open(): void;
    /**
     * Closes menu.
     */
    close(): void;
    /**
     * Toggles menu open and close.
     */
    toggle(): void;
}
//# sourceMappingURL=ExportingMenu.d.ts.map