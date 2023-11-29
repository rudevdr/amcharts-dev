import { Entity } from "../../core/util/Entity";
import { Disposer } from "../../core/util/Disposer";
import exportingCSS from "./ExportingCSS";
import * as $array from "../../core/util/Array";
import * as $utils from "../../core/util/Utils";
/**
 * Displays a menu for [[Exporting]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/exporting/} for more info
 */
export class ExportingMenu extends Entity {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_menuElement", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_iconElement", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_listElement", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_itemElements", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_itemDisposers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_cssDisposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_activeItem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isOpen", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_isOver", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    _afterNew() {
        super._afterNew();
        this._setRawDefault("container", this._root._inner);
        this._setRawDefault("align", "right");
        this._setRawDefault("valign", "top");
        this._setRawDefault("useDefaultCSS", true);
        this._setRawDefault("autoClose", true);
        this._setRawDefault("deactivateRoot", true);
        this._setRawDefault("items", [{
                type: "separator",
                label: this._t("Export")
            }, {
                type: "format",
                format: "png",
                exportType: "image",
                label: this._t("PNG"),
                sublabel: this._t("Image")
            }, {
                type: "format",
                format: "jpg",
                exportType: "image",
                label: this._t("JPG"),
                sublabel: this._t("Image")
            }, {
                type: "format",
                format: "pdf",
                exportType: "image",
                label: this._t("PDF"),
                sublabel: this._t("Image")
            }, {
                type: "separator",
                exportType: "data",
                //label: this._t("Data")
            }, {
                type: "format",
                format: "json",
                exportType: "data",
                label: this._t("JSON"),
                sublabel: this._t("Data")
            }, {
                type: "format",
                format: "csv",
                exportType: "data",
                label: this._t("CSV"),
                sublabel: this._t("Data")
            }, {
                type: "format",
                format: "xlsx",
                exportType: "data",
                label: this._t("XLSX"),
                sublabel: this._t("Data")
            }, {
                type: "format",
                format: "pdfdata",
                exportType: "data",
                label: this._t("PDF"),
                sublabel: this._t("Data")
            }, {
                type: "format",
                format: "html",
                exportType: "data",
                label: this._t("HTML"),
                sublabel: this._t("Data")
            }, {
                type: "separator"
            }, {
                type: "format",
                format: "print",
                exportType: "print",
                label: this._t("Print")
            }]);
        const menuElement = document.createElement("div");
        this._menuElement = menuElement;
        this.setPrivate("menuElement", this._menuElement);
        const iconElement = document.createElement("a");
        this._iconElement = iconElement;
        this._listElement = document.createElement("ul");
        this._listElement.setAttribute("role", "menu");
        this.setPrivate("listElement", this._listElement);
        this._applyClassNames();
        iconElement.innerHTML = '<svg fill="none" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/></svg>';
        iconElement.setAttribute("tabindex", this._root.tabindex.toString());
        iconElement.setAttribute("aria-label", this._t("Export") + "; " + this._t("Press ENTER to open"));
        iconElement.setAttribute("role", "button");
        if ($utils.supports("keyboardevents")) {
            this._disposers.push($utils.addEventListener(document, "keydown", (ev) => {
                if (document.activeElement == this._iconElement || this.isOpen) {
                    if (ev.keyCode == 27) {
                        // ESC
                        this.close();
                    }
                    else if (ev.keyCode == 13) {
                        // ENTER
                        if (this._activeItem) {
                            this._handleClick(this._activeItem);
                        }
                        else {
                            this.toggle();
                        }
                    }
                    else if (ev.keyCode == 38 || ev.keyCode == 40) {
                        const items = this.get("items", []);
                        let currentIndex = items.indexOf(this._activeItem);
                        if (this.get("valign") == "top" && currentIndex == -1) {
                            currentIndex = items.length;
                        }
                        const dir = ev.keyCode == 38 ? -1 : 1;
                        let newIndex = currentIndex + dir;
                        let newItem;
                        do {
                            if (newIndex < 0) {
                                newIndex = items.length - 1;
                            }
                            else if (newIndex > (items.length - 1)) {
                                newIndex = 0;
                            }
                            if (items[newIndex].type == "separator") {
                                newIndex += dir;
                            }
                            else {
                                newItem = items[newIndex];
                            }
                        } while (!newItem);
                        if (newItem) {
                            this._handleItemFocus(newItem);
                        }
                    }
                }
            }));
        }
        this._disposers.push($utils.addEventListener(iconElement, "click", (ev) => {
            ev.stopImmediatePropagation();
            this.toggle();
        }));
        menuElement.appendChild(this._iconElement);
        menuElement.appendChild(this._listElement);
        const container = this.get("container", this._root._inner);
        container.appendChild(this._menuElement);
        this._disposers.push($utils.addEventListener(menuElement, $utils.getRendererEvent("pointerover"), (_ev) => {
            this._isOver = true;
            if (this.get("deactivateRoot")) {
                this._root._renderer.interactionsEnabled = false;
            }
        }));
        this._disposers.push($utils.addEventListener(menuElement, $utils.getRendererEvent("pointerout"), (_ev) => {
            if (this.get("deactivateRoot") && (this.isOpen || this._isOver)) {
                this._root._renderer.interactionsEnabled = true;
            }
            this._isOver = false;
        }));
        this._disposers.push(new Disposer(() => {
            if (this._menuElement) {
                container.removeChild(this._menuElement);
            }
        }));
        this._disposers.push($utils.addEventListener(document, "click", (_ev) => {
            if (this.isOpen && !this._isOver) {
                this.close();
            }
        }));
        this.loadDefaultCSS();
        this._root.addDisposer(this);
        this.events.dispatch("menucreated", {
            type: "menucreated",
            target: this
        });
    }
    _afterChanged() {
        super._afterChanged();
        if (this._itemElements.length == 0) {
            this.createItems();
        }
        if (this.isDirty("useDefaultCSS")) {
            if (this.get("useDefaultCSS")) {
                this.loadDefaultCSS();
            }
            else if (this._cssDisposer) {
                this._cssDisposer.dispose();
            }
        }
        if (this.isDirty("exporting")) {
            const exporting = this.get("exporting");
            if (exporting) {
                this.createItems();
            }
        }
        if (this.isDirty("align") || this.isDirty("valign")) {
            this._applyClassNames();
        }
        if (this.isDirty("container")) {
            const container = this.get("container");
            if (container) {
                container.appendChild(this._menuElement);
            }
        }
    }
    _dispose() {
        super._dispose();
        $array.each(this._itemDisposers, (x) => {
            x.dispose();
        });
    }
    _applyClassNames() {
        const align = this.get("align", "right");
        const valign = this.get("valign", "top");
        const status = this.isOpen ? "am5exporting-menu-open" : "am5exporting-menu-closed";
        this._menuElement.className = "am5exporting am5exporting-menu am5exporting-align-" + align + " am5exporting-valign-" + valign + " " + status;
        this._iconElement.className = "am5exporting am5exporting-icon am5exporting-align-" + align + " am5exporting-valign-" + valign;
        this._listElement.className = "am5exporting am5exporting-list am5exporting-align-" + align + " am5exporting-valign-" + valign;
    }
    /**
     * @ignore
     */
    createItems() {
        const exporting = this.get("exporting");
        if (!exporting) {
            return;
        }
        this._listElement.innerHTML = "";
        this._itemElements = [];
        const items = this.get("items", []);
        const supportedFormats = exporting.supportedFormats();
        const supportedExportTypes = exporting.supportedExportTypes();
        $array.each(this._itemDisposers, (x) => {
            x.dispose();
        });
        this._itemDisposers.length = 0;
        $array.each(items, (item) => {
            if (item.format && supportedFormats.indexOf(item.format) == -1) {
                return;
            }
            if (item.exportType && supportedExportTypes.indexOf(item.exportType) == -1) {
                return;
            }
            const li = document.createElement("li");
            li.setAttribute("role", "menuitem");
            li.className = "am5exporting am5exporting-item am5exporting-type-" + item.type;
            if (item.format) {
                li.className += " am5exporting-format-" + item.format;
            }
            const a = document.createElement("a");
            let ariaLabel = this._t("Export");
            if (item.label) {
                a.innerHTML = item.label;
                ariaLabel += " " + item.label;
            }
            if (item.sublabel) {
                a.innerHTML += " <span class=\"am5exporting-label-alt\">" + item.sublabel + "</span>";
                ariaLabel += " (" + item.sublabel + ")";
            }
            if (item.callback) {
                this._itemDisposers.push($utils.addEventListener(a, "click", (_ev) => {
                    item.callback.call(item.callbackTarget || this);
                }));
                a.setAttribute("tabindex", this._root.tabindex.toString());
            }
            else if (item.format && exporting) {
                this._itemDisposers.push($utils.addEventListener(a, "click", (_ev) => {
                    this._handleClick(item);
                }));
                this._itemDisposers.push($utils.addEventListener(a, "focus", (_ev) => {
                    this._handleItemFocus(item);
                }));
                this._itemDisposers.push($utils.addEventListener(a, "blur", (_ev) => {
                    this._handleItemBlur(item);
                }));
                a.setAttribute("tabindex", this._root.tabindex.toString());
                a.setAttribute("aria-label", ariaLabel);
            }
            item.element = a;
            li.appendChild(a);
            this._listElement.appendChild(li);
            this._itemElements.push(li);
        });
    }
    _handleClick(item) {
        const exporting = this.get("exporting");
        if (this.get("autoClose")) {
            this.close();
        }
        if (item.format == "print") {
            exporting.print();
        }
        else {
            exporting.download(item.format);
        }
    }
    _handleItemFocus(item) {
        if (item != this._activeItem) {
            if (this._activeItem) {
                this._activeItem.element.className = "";
            }
            this._activeItem = item;
            item.element.className = "am5exporting-item-active";
            item.element.focus();
        }
    }
    _handleItemBlur(item) {
        item.element.className = "";
        if (item == this._activeItem) {
            this._activeItem = undefined;
        }
        this.setTimeout(() => {
            if (!document.activeElement || !$utils.contains(this.get("container"), document.activeElement)) {
                this.close();
            }
        }, 10);
    }
    /**
     * Loads the default CSS.
     *
     * @ignore Exclude from docs
     */
    loadDefaultCSS() {
        const disposer = exportingCSS($utils.getShadowRoot(this._root.dom), this._root);
        this._disposers.push(disposer);
        this._cssDisposer = disposer;
        // if (this._element) {
        // 	this._element.style.display = "";
        // }
    }
    /**
     * Opens menu.
     */
    open() {
        this.setTimeout(() => {
            this.isOpen = true;
            if (this.get("deactivateRoot")) {
                this._root._renderer.interactionsEnabled = false;
            }
            this._applyClassNames();
            this.events.dispatch("menuopened", {
                type: "menuopened",
                target: this
            });
        }, 1);
    }
    /**
     * Closes menu.
     */
    close() {
        this.isOpen = false;
        if (this.get("deactivateRoot")) {
            this._root._renderer.interactionsEnabled = true;
        }
        $utils.blur();
        this._applyClassNames();
        this.events.dispatch("menuclosed", {
            type: "menuclosed",
            target: this
        });
    }
    /**
     * Toggles menu open and close.
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        }
        else {
            this.open();
        }
    }
}
Object.defineProperty(ExportingMenu, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ExportingMenu"
});
Object.defineProperty(ExportingMenu, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Entity.classNames.concat([ExportingMenu.className])
});
//# sourceMappingURL=ExportingMenu.js.map