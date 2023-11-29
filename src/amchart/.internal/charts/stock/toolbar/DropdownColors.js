import { color } from "../../../core/util/Color";
import { ColorSet } from "../../../core/util/ColorSet";
import { Dropdown } from "./Dropdown";
import * as $array from "../../../core/util/Array";
import * as $utils from "../../../core/util/Utils";
/**
 * A dropdown used for color picker control.
 *
 * Should not be used as standalone control.
 */
export class DropdownColors extends Dropdown {
    // private _itemDisposers: Array<IDisposer> = [];
    _afterNew() {
        super._afterNew();
        this._root.addDisposer(this);
    }
    _initElements() {
        super._initElements();
        // Create container
        const container = this.getPrivate("container");
        // Create list
        const list = document.createElement("ul");
        list.className = "am5stock-control-colors";
        container.appendChild(list);
        this.setPrivate("list", list);
        this._initItems();
    }
    _initItems() {
        const list = this.getPrivate("list");
        list.innerHTML = "";
        let cs = this.get("colors");
        if (!cs) {
            cs = ColorSet.new(this._root, {});
        }
        const colors = cs.get("colors", []);
        $array.each(colors, (item) => {
            this.addItem(item);
        });
        this._initOpacity();
    }
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("colors") || this.isDirty("useOpacity") || this.isPrivateDirty("color") || this.isPrivateDirty("opacity")) {
            this._initItems();
        }
    }
    _dispose() {
        super._dispose();
    }
    addItem(color) {
        const currentColor = this.getPrivate("color") ? this.getPrivate("color").hex : 0;
        const list = this.getPrivate("list");
        const item = document.createElement("li");
        item.className = "am5stock-control-color";
        if (currentColor == color.hex) {
            item.className += " am5stock-control-active";
        }
        item.style.background = color.toCSS();
        list.appendChild(item);
        // Add click event
        this._disposers.push($utils.addEventListener(item, "click", (_ev) => {
            this.hide();
            this.events.dispatch("invoked", {
                type: "invoked",
                color: color,
                target: this
            });
        }));
    }
    _initOpacity() {
        if (this.get("useOpacity")) {
            const currentOpacity = this.getPrivate("opacity", 1);
            const list = this.getPrivate("list");
            const hr = document.createElement("hr");
            list.appendChild(hr);
            for (let opacity = 100; opacity >= 0; opacity -= 25) {
                const fill = color(0x000000);
                const item = document.createElement("li");
                item.innerHTML = opacity + "%";
                item.className = "am5stock-control-opacity am5stock-control-opacity-" + opacity;
                if (currentOpacity * 100 == opacity) {
                    item.className += " am5stock-control-active";
                }
                item.style.background = fill.toCSS(opacity / 100);
                list.appendChild(item);
                // Add click event
                this._disposers.push($utils.addEventListener(item, "click", (_ev) => {
                    this.hide();
                    this.events.dispatch("invokedOpacity", {
                        type: "invokedOpacity",
                        opacity: opacity / 100,
                        target: this
                    });
                }));
            }
        }
    }
}
Object.defineProperty(DropdownColors, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "DropdownColors"
});
Object.defineProperty(DropdownColors, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Dropdown.classNames.concat([DropdownColors.className])
});
//# sourceMappingURL=DropdownColors.js.map