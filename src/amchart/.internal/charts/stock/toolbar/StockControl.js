import { Entity } from "../../../core/util/Entity";
import { StockIcons } from "./StockIcons";
//import * as $array from "../../core/util/Array";
import * as $utils from "../../../core/util/Utils";
/**
 * A base class for controls on [[StockToolbar]].
 */
export class StockControl extends Entity {
    // private _itemDisposers: Array<IDisposer> = [];
    _afterNew() {
        super._afterNew();
        // Inherit default themes from chart
        this._defaultThemes = this.get("stockChart")._defaultThemes;
        super._afterNewApplyThemes();
        this._initElements();
        this._applyClassNames();
        this._root.addDisposer(this);
    }
    _initElements() {
        // Create button
        const button = document.createElement("div");
        button.setAttribute("title", this.get("description", this.get("name", "")));
        this.setPrivate("button", button);
        // Create icon
        const icon = document.createElement("div");
        icon.appendChild(this._getIcon());
        if (this.get("icon") == "none") {
            icon.style.display = "none";
        }
        button.appendChild(icon);
        this.setPrivate("icon", icon);
        // Create label
        const name = this.get("name", "");
        const label = document.createElement("div");
        label.innerHTML = name;
        if (name == "") {
            label.style.display = "none";
        }
        button.appendChild(label);
        this.setPrivate("label", label);
        // Add click event
        this._disposers.push($utils.addEventListener(button, "click", (ev) => {
            //ev.stopImmediatePropagation();
            if (this.get("togglable") != false) {
                this._handleClick();
            }
            if (this.events.isEnabled("click")) {
                this.events.dispatch("click", {
                    type: "click",
                    target: this,
                    originalEvent: ev
                });
            }
        }));
    }
    _applyClassNames() {
        this.getPrivate("button").className = "am5stock am5stock-control am5stock-control-button";
        this.getPrivate("label").className = "am5stock-control-label";
        this.getPrivate("icon").className = "am5stock-control-icon";
    }
    _getIcon() {
        const userIcon = this.get("icon");
        if (userIcon && userIcon != "none") {
            return userIcon;
        }
        return this._getDefaultIcon();
    }
    _getDefaultIcon() {
        return StockIcons.getIcon("Default");
    }
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("visible") && !this.get("visible")) {
            this.getPrivate("button").style.display = "none";
        }
        if (this.isDirty("name")) {
            this._setLabel(this.get("name", ""));
        }
        if (this.isDirty("active")) {
            const button = this.getPrivate("button");
            if (this.get("active")) {
                $utils.addClass(button, "am5stock-control-button-active");
            }
            else {
                $utils.removeClass(button, "am5stock-control-button-active");
            }
        }
        if (this.isDirty("align")) {
            if (this.get("align") == "right") {
                $utils.addClass(this.getPrivate("button"), "am5stock-align-right");
            }
            else {
                $utils.removeClass(this.getPrivate("button"), "am5stock-align-right");
            }
        }
        // todo icon
    }
    _dispose() {
        super._dispose();
        $utils.removeElement(this.getPrivate("button"));
    }
    _setLabel(name) {
        const label = this.getPrivate("label");
        label.innerHTML = name;
        if (name == "") {
            label.style.display = "none";
        }
        else {
            label.style.display = "";
        }
        const button = this.getPrivate("button");
        button.setAttribute("title", this.get("description", this.get("name", "")));
    }
    hide() {
        this.getPrivate("button").style.display = "none";
    }
    show() {
        this.getPrivate("button").style.display = "";
    }
    _handleClick() {
        this.set("active", !this.get("active"));
    }
}
Object.defineProperty(StockControl, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "StockControl"
});
Object.defineProperty(StockControl, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Entity.classNames.concat([StockControl.className])
});
//# sourceMappingURL=StockControl.js.map