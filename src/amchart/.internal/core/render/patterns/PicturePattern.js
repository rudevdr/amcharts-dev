import { Pattern } from "./Pattern";
/**
 * Picture pattern.
 *
 * @since 5.2.15
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/} for more info
 */
export class PicturePattern extends Pattern {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_image", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _beforeChanged() {
        super._beforeChanged();
        this._clear = true;
        if (this.isDirty("src")) {
            this._load();
        }
        const canvas = this.get("canvas");
        if (canvas) {
            this.set("width", canvas.width);
            this.set("height", canvas.height);
        }
    }
    _draw() {
        super._draw();
        const image = this._image;
        if (image) {
            const patternWidth = this.get("width", 100);
            const patternHeight = this.get("height", 100);
            // Fit
            const fit = this.get("fit", "image");
            let width = 0;
            let height = 0;
            if (fit == "pattern") {
                width = patternWidth;
                height = patternHeight;
            }
            else {
                width = image.width;
                height = image.height;
                if (fit == "image") {
                    this.set("width", width);
                    this.set("height", height);
                }
            }
            // Position
            const centered = this.get("centered", true);
            let x = 0;
            let y = 0;
            if (centered) {
                x = patternWidth / 2 - width / 2;
                y = patternHeight / 2 - height / 2;
            }
            this._display.image(image, width, height, x, y);
        }
        const canvas = this.get("canvas");
        if (canvas) {
            this._display.image(canvas, canvas.width, canvas.height, 0, 0);
        }
    }
    _load() {
        const src = this.get("src");
        if (src) {
            const image = new Image();
            //image.crossOrigin = "Anonymous";
            image.src = src;
            image.decode().then(() => {
                this._image = image;
                this._draw();
                if (this.events.isEnabled("loaded")) {
                    this.events.dispatch("loaded", { type: "loaded", target: this });
                }
            }).catch((_error) => {
                // TODO: maybe raise error?
            });
        }
    }
}
Object.defineProperty(PicturePattern, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "PicturePattern"
});
Object.defineProperty(PicturePattern, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Pattern.classNames.concat([PicturePattern.className])
});
//# sourceMappingURL=PicturePattern.js.map