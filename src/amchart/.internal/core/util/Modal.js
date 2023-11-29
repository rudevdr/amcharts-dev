import { Entity } from "./Entity";
import { StyleRule } from "./Utils";
import { MultiDisposer, CounterDisposer } from "../../core/util/Disposer";
import * as $utils from "./Utils";
/**
 * @ignore
 */
let rules;
/**
 * @ignore
 */
function modalCSS(element, root, _prefix) {
    const ic = root.interfaceColors;
    const active = ic.get("secondaryButton").toCSS();
    const text = ic.get("text").toCSS();
    const shadow = ic.get("alternativeBackground").toCSS(0.45);
    //const altbg = ic.get("alternativeBackground")!.toCSS();
    if (!rules) {
        const disposer = new MultiDisposer([
            new StyleRule(element, ".am5-modal", {
                "width": "100%",
                "height": "100%",
                "position": "absolute",
                "z-index": "100000",
                "top": "0",
                "left": "0"
            }),
            new StyleRule(element, ".am5-modal-curtain", {
                "top": "0",
                "left": "0",
                "width": "100%",
                "height": "100%",
                "position": "absolute",
                "background": ic.get("background").toCSS(0.5),
                "z-index": "100"
            }),
            new StyleRule(element, ".am5-modal-wrapper", {
                "top": "0",
                "left": "0",
                "width": "100%",
                "height": "100%",
                "position": "absolute",
                "text-align": "center",
                "white-space": "nowrap",
                "background": ic.get("background").toCSS(0.5),
                "z-index": "101"
            }),
            new StyleRule(element, ".am5-modal-wrapper:before", {
                "content": "''",
                "display": "inline-block",
                "height": "100%",
                "vertical-align": "middle",
                "margin-right": "-0.25em"
            }),
            new StyleRule(element, ".am5-modal-content", {
                "display": "inline-block",
                "padding": "1.2em",
                "vertical-align": "middle",
                "text-align": "left",
                "white-space": "normal",
                "background": ic.get("background").toCSS(),
                //"border": "1px solid " + ic.get("alternativeBackground")!.toCSS(),
                "border-radius": "4px",
                "-webkit-box-shadow": "0px 0px 36px 0px " + shadow,
                "box-shadow": "0px 0px 36px 0px " + shadow,
                "color": text
            }),
            new StyleRule(element, ".am5-modal-content h1", {
                "font-size": "1em",
                "margin": "0 0 0.5em 0"
            }),
            new StyleRule(element, ".am5-modal-table", {
                "display": "table",
                "margin": "1em 0"
            }),
            new StyleRule(element, ".am5-modal-table-row", {
                "display": "table-row"
            }),
            new StyleRule(element, ".am5-modal-table-heading", {
                "display": "table-heading",
                "padding": "3px 10px 3px 0",
            }),
            new StyleRule(element, ".am5-modal-table-cell", {
                "display": "table-cell",
                "padding": "3px 0 3px 0",
            }),
            new StyleRule(element, ".am5-modal-table-cell > *", {
                "vertical-align": "middle"
            }),
            new StyleRule(element, ".am5-modal-content input[type=text], .am5-modal-content input[type=number], .am5-modal-content select", {
                "border": "1px solid " + active,
                "border-radius": "4px",
                "padding": "3px 5px",
                "margin": "2px"
            }),
            new StyleRule(element, ".am5-modal-input-narrow", {
                "width": "50px"
            }),
            new StyleRule(element, ".am5-modal-button", {
                "font-weight": "400",
                "color": ic.get("secondaryButtonText").toCSS(),
                "line-height": "1.5",
                "text-align": "center",
                "text-decoration": "none",
                "vertical-align": "middle",
                "cursor": "pointer",
                "padding": "0.2em 0.8em",
                "font-size": "1em",
                "border-radius": "0.25em",
                "margin": "0 0.25em 0 0",
                "border": "1px solid " + ic.get("secondaryButtonStroke").toCSS(),
                "background": ic.get("secondaryButton").toCSS()
            }),
            new StyleRule(element, ".am5-modal-button:hover", {
                "background": ic.get("secondaryButtonHover").toCSS()
            }),
            new StyleRule(element, ".am5-modal-button.am5-modal-primary", {
                "color": ic.get("primaryButtonText").toCSS(),
                "border": "1px solid " + ic.get("primaryButtonStroke").toCSS(),
                "background": ic.get("primaryButton").toCSS()
            }),
            new StyleRule(element, ".am5-modal-button.am5-modal-primary:hover", {
                "background": ic.get("primaryButtonHover").toCSS()
            }),
        ]);
        rules = new CounterDisposer(() => {
            rules = undefined;
            disposer.dispose();
        });
    }
    return rules.increment();
}
/**
 * Used to display a modal dialog with HTML content.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/modal-popups/} for more info
 */
export class Modal extends Entity {
    //protected _currentPass: number = 0;
    _afterNew() {
        // Applying themes because this will not have parents
        super._afterNewApplyThemes();
        // Defaults
        this._setRawDefault("deactivateRoot", true);
        // Load CSS
        modalCSS($utils.getShadowRoot(this._root.dom), this._root);
        // Create elements
        const container = document.createElement("div");
        container.className = "am5-modal";
        container.style.display = "none";
        this.root._inner.appendChild(container);
        this.setPrivate("container", container);
        const curtain = document.createElement("div");
        curtain.className = "am5-modal-curtain";
        container.appendChild(curtain);
        this.setPrivate("curtain", curtain);
        this._disposers.push($utils.addEventListener(curtain, "click", () => {
            this.cancel();
        }));
        const wrapper = document.createElement("div");
        wrapper.className = "am5-modal-wrapper";
        container.appendChild(wrapper);
        this.setPrivate("wrapper", wrapper);
        const content = document.createElement("div");
        content.className = "am5-modal-content";
        wrapper.appendChild(content);
        this.setPrivate("content", content);
        const html = this.get("content");
        if (html) {
            content.innerHTML = html;
        }
        // Close on ESC
        if ($utils.supports("keyboardevents")) {
            this._disposers.push($utils.addEventListener(document, "keydown", (ev) => {
                if (this.isOpen() && ev.keyCode == 27) {
                    this.cancel();
                }
            }));
        }
    }
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("content")) {
            this.getPrivate("content").innerHTML = this.get("content", "");
        }
    }
    /**
     * Returns `true` if modal is currently open.
     *
     * @return  Modal open?
     */
    isOpen() {
        return this.getPrivate("container").style.display != "none";
    }
    /**
     * Opens modal.
     */
    open() {
        this.getPrivate("container").style.display = "block";
        if (this.get("deactivateRoot")) {
            this.setTimeout(() => {
                this._root._renderer.interactionsEnabled = false;
            }, 10);
        }
        this.events.dispatch("opened", {
            type: "opened",
            target: this
        });
    }
    /**
     * Closes modal.
     */
    close() {
        this.getPrivate("container").style.display = "none";
        if (this.get("deactivateRoot")) {
            this._root._renderer.interactionsEnabled = true;
        }
        this.events.dispatch("closed", {
            type: "closed",
            target: this
        });
    }
    /**
     * Closes modal and invokes `cancelled` event.
     */
    cancel() {
        this.getPrivate("container").style.display = "none";
        if (this.get("deactivateRoot")) {
            this._root._renderer.interactionsEnabled = true;
        }
        this.events.dispatch("cancelled", {
            type: "cancelled",
            target: this
        });
    }
    /**
     * Disposes modal.
     */
    dispose() {
        super.dispose();
        const container = this.getPrivate("container");
        if (container.parentElement) {
            container.parentElement.removeChild(container);
        }
    }
}
Object.defineProperty(Modal, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Modal"
});
Object.defineProperty(Modal, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Entity.classNames.concat([Modal.className])
});
//# sourceMappingURL=Modal.js.map