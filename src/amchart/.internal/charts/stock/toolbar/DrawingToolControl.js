import { StockControl } from "./StockControl";
import { DropdownList } from "./DropdownList";
import { StockIcons } from "./StockIcons";
import * as $array from "../../../core/util/Array";
/**
 * Control which allows selecting drawing tool.
 *
 * Should not be instantiated directly. Use [[DrawingControl]] instead.
 */
export class DrawingToolControl extends StockControl {
    _afterNew() {
        // Do parent stuff
        super._afterNew();
        // Create list of tools
        const list = DropdownList.new(this._root, {
            control: this,
            parent: this.getPrivate("button")
        });
        this.setPrivate("list", list);
        list.events.on("closed", (_ev) => {
            this.set("active", false);
        });
        list.events.on("invoked", (ev) => {
            this.setTool(ev.item.label);
            this.events.dispatch("selected", {
                type: "selected",
                tool: ev.item.id,
                target: this
            });
        });
        this.on("active", (active) => {
            if (active) {
                this.setTimeout(() => list.show(), 10);
            }
            else {
                list.hide();
            }
        });
        const button = this.getPrivate("button");
        button.className = button.className + " am5stock-control-dropdown";
        this._initTools();
    }
    setTool(tool) {
        this.getPrivate("icon").innerHTML = "";
        this.getPrivate("icon").appendChild(this._getToolIcon(tool));
        //this.getPrivate("label")!.innerHTML = tool;
        this._setLabel(this._root.language.translateAny(tool));
    }
    _initTools() {
        const list = this.getPrivate("list");
        const tools = this.get("tools");
        const items = [];
        $array.each(tools, (tool) => {
            items.push({
                id: tool,
                label: this._root.language.translateAny(tool),
                icon: this._getToolIcon(tool)
            });
        });
        list.set("items", items);
    }
    _getToolIcon(tool) {
        return StockIcons.getIcon(tool);
    }
    _afterChanged() {
        super._afterChanged();
        if (this.isDirty("tools")) {
            this._initTools();
        }
        // if (this.isDirty("name")) {
        // 	this.getPrivate("label")!.innerHTML = this.get("name", "");
        // }
        // todo icon
    }
    _dispose() {
        super._dispose();
        // $array.each(this._itemDisposers, (x) => {
        // 	x.dispose();
        // });
    }
}
Object.defineProperty(DrawingToolControl, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "DrawingToolControl"
});
Object.defineProperty(DrawingToolControl, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: StockControl.classNames.concat([DrawingToolControl.className])
});
//# sourceMappingURL=DrawingToolControl.js.map