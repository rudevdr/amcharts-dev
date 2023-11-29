import { StockControl } from "./StockControl";
import { Dropdown } from "./Dropdown";
/**
 * A generic control which creates a searchable list of items in a dropdown.
 *
 * Can be used in a [[StockToolbar]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/dropdown-list-control/} for more info
 */
export class DropdownControl extends StockControl {
    _afterNew() {
        super._afterNew();
        const button = this.getPrivate("button");
        button.className = button.className + " am5stock-control-dropdown";
    }
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("html")) {
            const container = this.getPrivate("container");
            if (container) {
                this.getPrivate("container").innerHTML = this.get("html", "");
            }
        }
    }
    _initElements() {
        super._initElements();
        // Create list
        const dropdownSettings = {
            control: this,
            parent: this.getPrivate("button"),
            scrollable: this.get("scrollable", false)
        };
        const dropdown = Dropdown.new(this._root, dropdownSettings);
        this.setPrivate("dropdown", dropdown);
        const container = document.createElement("div");
        container.className = "am5stock-control-list";
        dropdown.getPrivate("container").appendChild(container);
        this.setPrivate("container", container);
        const html = this.get("html", "");
        container.innerHTML = html;
        dropdown.events.on("closed", (_ev) => {
            this.set("active", false);
        });
        this.on("active", (active) => {
            if (active) {
                this.setTimeout(() => dropdown.show(), 10);
            }
            else {
                dropdown.hide();
            }
        });
    }
    _dispose() {
        super._dispose();
    }
}
Object.defineProperty(DropdownControl, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "DropdownControl"
});
Object.defineProperty(DropdownControl, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: StockControl.classNames.concat([DropdownControl.className])
});
//# sourceMappingURL=DropdownControl.js.map