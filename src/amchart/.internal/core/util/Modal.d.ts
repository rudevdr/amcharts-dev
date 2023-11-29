import { Entity, IEntitySettings, IEntityPrivate, IEntityEvents } from "./Entity";
export interface IModalSettings extends IEntitySettings {
    /**
     * HTML content of the modal.
     */
    content?: string;
    /**
     * When modal is open, all interactions for the underlying chart will be
     * disabled.
     *
     * @default true
     * @since 5.2.11
     */
    deactivateRoot?: boolean;
}
export interface IModalPrivate extends IEntityPrivate {
    container: HTMLDivElement;
    curtain: HTMLDivElement;
    wrapper: HTMLDivElement;
    content: HTMLDivElement;
}
export interface IModalEvents extends IEntityEvents {
    "opened": {};
    "closed": {};
    "cancelled": {};
}
/**
 * Used to display a modal dialog with HTML content.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/modal-popups/} for more info
 */
export declare class Modal extends Entity {
    static className: string;
    static classNames: Array<string>;
    _settings: IModalSettings;
    _privateSettings: IModalPrivate;
    _events: IModalEvents;
    protected _afterNew(): void;
    _beforeChanged(): void;
    /**
     * Returns `true` if modal is currently open.
     *
     * @return  Modal open?
     */
    isOpen(): boolean;
    /**
     * Opens modal.
     */
    open(): void;
    /**
     * Closes modal.
     */
    close(): void;
    /**
     * Closes modal and invokes `cancelled` event.
     */
    cancel(): void;
    /**
     * Disposes modal.
     */
    dispose(): void;
}
//# sourceMappingURL=Modal.d.ts.map