import { Sprite } from "./Sprite";
import * as $type from "../util/Type";
/**
 * Displays an image.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/images/} for more info
 * @important
 */
export class Picture extends Sprite {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_display", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._root._renderer.makePicture(undefined)
        });
    }
    _changed() {
        super._changed();
        if (this.isDirty("width")) {
            const width = this.get("width");
            this._display.width = $type.isNumber(width) ? width : undefined;
        }
        if (this.isDirty("height")) {
            const height = this.get("height");
            this._display.height = $type.isNumber(height) ? height : undefined;
        }
        if (this.isDirty("shadowColor")) {
            this._display.clear();
            const shadowColor = this.get("shadowColor");
            this._display.shadowColor = shadowColor == null ? undefined : shadowColor;
        }
        if (this.isDirty("shadowBlur")) {
            this._display.clear();
            this._display.shadowBlur = this.get("shadowBlur");
        }
        if (this.isDirty("shadowOffsetX")) {
            this._display.clear();
            this._display.shadowOffsetX = this.get("shadowOffsetX");
        }
        if (this.isDirty("shadowOffsetY")) {
            this._display.clear();
            this._display.shadowOffsetY = this.get("shadowOffsetY");
        }
        if (this.isDirty("shadowOpacity")) {
            this._display.clear();
            this._display.shadowOpacity = this.get("shadowOpacity");
        }
        if (this.isDirty("src") || this.isDirty("cors")) {
            this._display.clear();
            this._load();
        }
    }
    _load() {
        const src = this.get("src");
        if (src) {
            let eventType = "loaded";
            const image = new Image();
            image.crossOrigin = this.get("cors", "anonymous");
            image.src = src;
            image.decode().then(() => {
                this._display.image = image;
                this._updateSize();
            }).catch((_error) => {
                eventType = "loaderror";
            });
            if (this.events.isEnabled(eventType)) {
                this.events.dispatch(eventType, { type: eventType, target: this });
            }
        }
    }
    _updateSize() {
        super._updateSize();
        const image = this._display.image;
        if (image) {
            let w = this.getPrivate("width", this.get("width"));
            let h = this.getPrivate("height", this.get("height"));
            const r = image.width && image.height ? image.width / image.height : 0;
            if ($type.isNumber(w) && $type.isNumber(h)) {
                this._display.width = w;
                this._display.height = h;
            }
            else if ($type.isNumber(w) && r) {
                h = w / r;
            }
            else if ($type.isNumber(h) && r) {
                w = h * r;
            }
            else {
                w = image.width;
                h = image.height;
            }
            if ($type.isNumber(w)) {
                this._display.width = w;
            }
            if ($type.isNumber(h)) {
                this._display.height = h;
            }
            this.markDirtyBounds();
            this.markDirty();
        }
    }
}
Object.defineProperty(Picture, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Picture"
});
Object.defineProperty(Picture, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Sprite.classNames.concat([Picture.className])
});
//# sourceMappingURL=Picture.js.map