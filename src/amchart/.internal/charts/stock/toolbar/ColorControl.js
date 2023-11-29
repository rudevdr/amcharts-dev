import { StockControl } from "./StockControl";
import { DropdownColors } from "./DropdownColors";
import { StockIcons } from "./StockIcons";
import * as $utils from "../../../core/util/Utils";
import StockToolbarCSS from "./StockToolbarCSS";
/**
 * Color picker control.
 */
export class ColorControl extends StockControl {
    _afterNew() {
        // Do parent stuff
        super._afterNew();
        // Create list of tools
        const dropdownSettings = {
            control: this,
            parent: this.getPrivate("button"),
            useOpacity: this.get("useOpacity")
        };
        if (this.get("colors")) {
            dropdownSettings.colors = this.get("colors");
        }
        const dropdown = DropdownColors.new(this._root, dropdownSettings);
        this.setPrivate("dropdown", dropdown);
        dropdown.events.on("closed", (_ev) => {
            this.set("active", false);
        });
        dropdown.events.on("invoked", (ev) => {
            this.setPrivate("color", ev.color);
            this.events.dispatch("selected", {
                type: "selected",
                color: ev.color,
                target: this
            });
        });
        dropdown.events.on("invokedOpacity", (ev) => {
            this.setPrivate("opacity", ev.opacity);
            this.events.dispatch("selectedOpacity", {
                type: "selectedOpacity",
                opacity: ev.opacity,
                target: this
            });
        });
        this.on("active", (active) => {
            if (active) {
                dropdown.setPrivate("color", this.getPrivate("color"));
                dropdown.setPrivate("opacity", this.getPrivate("opacity"));
                this.setTimeout(() => dropdown.show(), 10);
            }
            else {
                dropdown.hide();
            }
        });
        this.onPrivate("color", () => {
            const color = this.getPrivate("color");
            this.getPrivate("icon").style.backgroundColor = color ? color.toCSS(this.getPrivate("opacity", 1)) : "";
        });
        this.onPrivate("opacity", () => {
            const color = this.getPrivate("color");
            this.getPrivate("icon").style.backgroundColor = color ? color.toCSS(this.getPrivate("opacity", 1)) : "";
        });
        // Add checkered background for showing opacity
        const bg = document.createElement("div");
        bg.className = "am5stock-control-icon-color-bg";
        this.getPrivate("icon").appendChild(bg);
        this.loadDefaultCSS();
    }
    _getDefaultIcon() {
        const icon = StockIcons.getIcon("Color");
        $utils.addClass(icon, "am5stock-control-icon-color");
        return icon;
    }
    /**
     * Loads the default CSS.
     *
     * @ignore Exclude from docs
     */
    loadDefaultCSS() {
        const disposer = StockToolbarCSS($utils.getShadowRoot(this._root.dom), this._root);
        this._disposers.push(disposer);
    }
}
Object.defineProperty(ColorControl, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ColorControl"
});
Object.defineProperty(ColorControl, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: StockControl.classNames.concat([ColorControl.className])
});
//# sourceMappingURL=ColorControl.js.map