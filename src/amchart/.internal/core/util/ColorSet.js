import { Entity } from "./Entity";
import { Color } from "./Color";
/**
 * An object which holds list of colors and can generate new ones.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/#Color_sets} for more info
 */
export class ColorSet extends Entity {
    //protected _currentPass: number = 0;
    _afterNew() {
        // Applying themes because color set will not have parent
        super._afterNewApplyThemes();
        this._dirty["colors"] = false;
    }
    _beforeChanged() {
        if (this.isDirty("colors")) {
            this.reset();
        }
    }
    /**
     * @ignore
     */
    generateColors() {
        this.setPrivate("currentPass", this.getPrivate("currentPass", 0) + 1);
        const pass = this.getPrivate("currentPass");
        const colors = this.get("colors", [this.get("baseColor", Color.fromHex(0xff0000))]);
        if (!this.getPrivate("numColors")) {
            this.setPrivate("numColors", colors.length);
        }
        //const len = colors.length;
        const len = this.getPrivate("numColors");
        //const start = len - this.getPrivate("numColors")!;
        const start = 0;
        const passOptions = this.get("passOptions");
        const reuse = this.get("reuse");
        for (let i = start; i < len; i++) {
            if (reuse) {
                colors.push(colors[i]);
            }
            else {
                const hsl = colors[i].toHSL();
                let h = hsl.h + (passOptions.hue || 0) * pass;
                while (h > 1)
                    h -= 1;
                let s = hsl.s + (passOptions.saturation || 0) * pass;
                //if (s > 1) s -= Math.floor(s);
                if (s > 1)
                    s = 1;
                if (s < 0)
                    s = 0;
                let l = hsl.l + (passOptions.lightness || 0) * pass;
                //if (l > 1) l -= Math.floor(l);
                while (l > 1)
                    l -= 1;
                colors.push(Color.fromHSL(h, s, l));
            }
        }
    }
    /**
     * Returns a [[Color]] at specific index.
     *
     * If there's no color at this index, a new color is generated.
     *
     * @param   index  Index
     * @return         Color
     */
    getIndex(index) {
        const colors = this.get("colors", []);
        const saturation = this.get("saturation");
        if (index >= colors.length) {
            this.generateColors();
            return this.getIndex(index);
        }
        return saturation != null ? Color.saturate(colors[index], saturation) : colors[index];
    }
    /**
     * Returns next [[Color]] in the list.
     *
     * If the list is out of colors, new ones are generated dynamically.
     */
    next() {
        let currentStep = this.getPrivate("currentStep", this.get("startIndex", 0));
        this.setPrivate("currentStep", currentStep + this.get("step", 1));
        return this.getIndex(currentStep);
    }
    /**
     * Resets counter to the start of the list, so the next call for `next()` will
     * return the first color.
     */
    reset() {
        this.setPrivate("currentStep", this.get("startIndex", 0));
        this.setPrivate("currentPass", 0);
    }
}
Object.defineProperty(ColorSet, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ColorSet"
});
Object.defineProperty(ColorSet, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Entity.classNames.concat([ColorSet.className])
});
//# sourceMappingURL=ColorSet.js.map