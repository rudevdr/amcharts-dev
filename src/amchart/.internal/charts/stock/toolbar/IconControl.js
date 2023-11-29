import { StockControl } from "./StockControl";
import { DropdownList } from "./DropdownList";
import { StockIcons } from "./StockIcons";
import * as $array from "../../../core/util/Array";
/**
 * Shows selection of icons to choose from for annotating [[StockChart]].
 *
 * This class is instantiated automatically, and should not be used standalone.
 */
export class IconControl extends StockControl {
    _afterNew() {
        // Do parent stuff
        super._afterNew();
        // Create list of tools
        const list = DropdownList.new(this._root, {
            control: this,
            parent: this.getPrivate("button"),
            searchable: false
        });
        this.setPrivate("list", list);
        list.getPrivate("list").className = "am5stock-control-icons";
        list.events.on("closed", (_ev) => {
            this.set("active", false);
        });
        list.events.on("invoked", (ev) => {
            const item = JSON.parse(ev.item.id);
            let icon;
            const icons = this.get("icons");
            $array.each(icons, (listIcon) => {
                if (item.svgPath == listIcon.svgPath) {
                    icon = listIcon;
                }
            });
            if (icon) {
                this.setIcon(icon);
                this.events.dispatch("selected", {
                    type: "selected",
                    icon: icon,
                    target: this
                });
            }
        });
        this.on("active", (active) => {
            if (active) {
                this.setTimeout(() => list.show(), 10);
            }
            else {
                list.hide();
            }
        });
        this._initIcons();
    }
    setIcon(icon) {
        this.getPrivate("icon").innerHTML = "";
        this.getPrivate("icon").appendChild(this._getDrawingIcon(icon));
        //this.getPrivate("label")!.style.display = "none";
    }
    _initIcons() {
        const list = this.getPrivate("list");
        const icons = this.get("icons");
        const items = [];
        $array.each(icons, (icon) => {
            items.push({
                id: JSON.stringify(icon),
                label: "",
                icon: this._getDrawingIcon(icon)
            });
        });
        list.set("items", items);
    }
    _getDrawingIcon(icon) {
        return StockIcons._getSVG({ viewbox: "0 0 50 50", path: icon.svgPath });
    }
    _afterChanged() {
        super._afterChanged();
        if (this.isDirty("icons")) {
            this._initIcons();
        }
    }
    _dispose() {
        super._dispose();
    }
}
Object.defineProperty(IconControl, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "IconControl"
});
Object.defineProperty(IconControl, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: StockControl.classNames.concat([IconControl.className])
});
//# sourceMappingURL=IconControl.js.map