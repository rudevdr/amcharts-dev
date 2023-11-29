import { Entity } from "../../../core/util/Entity";
//import type { IDisposer } from "../../../core/util/Disposer";
import * as $utils from "../../../core/util/Utils";
/**
 * A dropdown control for [[StockToolbar]].
 */
export class Dropdown extends Entity {
    // private _itemDisposers: Array<IDisposer> = [];
    _afterNew() {
        super._afterNew();
        // Inherit default themes from chart
        this._defaultThemes = this.get("control")._defaultThemes;
        super._afterNewApplyThemes();
        this._initElements();
        this._root.addDisposer(this);
        // Close on ESC
        if ($utils.supports("keyboardevents")) {
            this._disposers.push($utils.addEventListener(document, "keydown", (ev) => {
                if (this.isOpen() && ev.keyCode == 27) {
                    this.hide();
                }
            }));
        }
        this._disposers.push($utils.addEventListener(this.getPrivate("container"), "click", (ev) => {
            if (this.isOpen()) {
                ev.preventDefault();
            }
        }));
        this._disposers.push($utils.addEventListener(document, "click", () => {
            if (this.isOpen()) {
                this.hide();
            }
        }));
    }
    _initElements() {
        // Create container
        const container = document.createElement("div");
        container.className = "am5stock-control-list-container";
        this._disposers.push($utils.addEventListener(container, "click", (ev) => {
            ev.stopPropagation();
        }));
        this.setPrivate("container", container);
        const arrow = document.createElement("div");
        arrow.className = "am5stock-control-list-arrow";
        container.appendChild(arrow);
        this.setPrivate("arrow", arrow);
        const parent = this.get("parent");
        if (parent) {
            parent.appendChild(container);
        }
        if (this.get("scrollable")) {
            this._sizeItems();
            this.root.container.onPrivate("height", () => {
                this._sizeItems();
            });
        }
        this.hide();
    }
    _sizeItems() {
        const container = this.getPrivate("container");
        container.style.maxHeight = (this.root.container.height() - 100) + "px";
        container.style.overflow = "auto";
    }
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("parent")) {
            const parent = this.get("parent");
            const container = this.getPrivate("container");
            if (parent && container) {
                parent.appendChild(container);
            }
        }
    }
    _dispose() {
        super._dispose();
    }
    /**
     * Returns `true` if dropdown is currently open.
     *
     * @return  Dropdown open?
     */
    isOpen() {
        return this.getPrivate("container").style.display != "none";
    }
    hide() {
        this.getPrivate("container").style.display = "none";
        this.events.dispatch("closed", {
            type: "closed",
            target: this
        });
    }
    show() {
        const arrow = this.getPrivate("arrow");
        const container = this.getPrivate("container");
        container.style.display = "";
        let offset = 0;
        const toolbar = this.get("control").getPrivate("toolbar");
        if (toolbar) {
            const toolbarContainer = this.get("control").getPrivate("toolbar").get("container");
            offset = Math.round(toolbarContainer.getBoundingClientRect().right - container.getBoundingClientRect().right);
        }
        if (offset < 0) {
            container.style.marginLeft = offset + "px";
            arrow.style.marginLeft = Math.abs(offset) + "px";
        }
        else {
            container.style.marginLeft = "";
            arrow.style.marginLeft = "";
        }
        this.events.dispatch("opened", {
            type: "opened",
            target: this
        });
    }
    toggle() {
        const container = this.getPrivate("container");
        if (container.style.display == "none") {
            this.show();
        }
        else {
            this.hide();
        }
    }
}
Object.defineProperty(Dropdown, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Dropdown"
});
Object.defineProperty(Dropdown, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Entity.classNames.concat([Dropdown.className])
});
//# sourceMappingURL=Dropdown.js.map