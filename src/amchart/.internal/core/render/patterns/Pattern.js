import { Entity } from "../../util/Entity";
/**
 * Base class for patterns.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/} for more info
 */
export class Pattern extends Entity {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_display", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._root._renderer.makeGraphics()
        });
        Object.defineProperty(this, "_backgroundDisplay", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._root._renderer.makeGraphics()
        });
        Object.defineProperty(this, "_clear", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_pattern", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _afterNew() {
        // Applying themes because pattern will not have parent
        super._afterNewApplyThemes();
    }
    get pattern() {
        return this._pattern;
    }
    _draw() { }
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("repetition") || this.isDirty("width") || this.isDirty("height") || this.isDirty("rotation") || this.isDirty("strokeWidth") || this.isDirty("strokeDasharray") || this.isDirty("strokeDashoffset") || this.isDirty("colorOpacity") || this.isDirty("fillOpacity")) {
            this._clear = true;
        }
        this._checkDirtyFill();
    }
    _checkDirtyFill() {
        if (this.isDirty("color") || this.isDirty("fill")) {
            this._clear = true;
        }
    }
    _changed() {
        super._changed();
        if (this._clear) {
            const repetition = this.get("repetition", "");
            const width = this.get("width", 100);
            const height = this.get("height", 100);
            const fill = this.get("fill");
            const fillOpacity = this.get("fillOpacity", 1);
            const backgroundDisplay = this._backgroundDisplay;
            const display = this._display;
            display.clear();
            backgroundDisplay.clear();
            if (fill && (fillOpacity > 0)) {
                backgroundDisplay.beginFill(fill, fillOpacity);
                backgroundDisplay.drawRect(0, 0, width, height);
                backgroundDisplay.endFill();
            }
            display.angle = this.get("rotation", 0);
            //display.pivot = { x: width / 2, y: height / 2 };
            this._draw();
            this._pattern = this._root._renderer.createPattern(display, backgroundDisplay, repetition, width, height);
        }
        this._clear = false;
    }
}
Object.defineProperty(Pattern, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Pattern"
});
Object.defineProperty(Pattern, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Entity.classNames.concat([Pattern.className])
});
//# sourceMappingURL=Pattern.js.map