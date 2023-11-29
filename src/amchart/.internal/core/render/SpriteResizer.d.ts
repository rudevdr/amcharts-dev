import type { Sprite, ISpritePointerEvent } from "./Sprite";
import type { IDisposer } from "../util/Disposer";
import { Container, IContainerPrivate, IContainerSettings, IContainerEvents } from "./Container";
import { Rectangle } from "./Rectangle";
import type { Template } from "../util/Template";
export interface ISpriteResizerSettings extends IContainerSettings {
    /**
     * Target [[Sprite]] element.
     */
    sprite?: Sprite;
    /**
     * Target [[Template]]. If a template is set, scale and rotation will be set on Template instead of a Sprite.
     */
    spriteTemplate?: Template<Sprite>;
    /**
     * Rotation increment in degrees.
     *
     * @default 10
     */
    rotationStep?: number;
}
export interface ISpriteResizerPrivate extends IContainerPrivate {
}
export interface ISpriteResizerEvents extends IContainerEvents {
}
export declare class SpriteResizer extends Container {
    _settings: ISpriteResizerSettings;
    _privateSettings: ISpriteResizerPrivate;
    _events: ISpriteResizerEvents;
    static className: string;
    static classNames: Array<string>;
    readonly rectangle: Rectangle;
    readonly gripL: Container;
    readonly gripR: Container;
    readonly gripT: Container;
    readonly gripB: Container;
    protected _is: number;
    protected _ix: number;
    protected _iw: number;
    protected _positionDP?: IDisposer;
    protected _isHover: boolean;
    protected _afterNew(): void;
    protected _resizeStart(grip: Sprite): void;
    protected _resize(grip: Sprite, c: number): void;
    protected _rotate(e: ISpritePointerEvent, delta: number): void;
    protected _createGrip(themeTag: string): Container;
    _updateChildren(): void;
    protected _updatePositions(): void;
}
//# sourceMappingURL=SpriteResizer.d.ts.map