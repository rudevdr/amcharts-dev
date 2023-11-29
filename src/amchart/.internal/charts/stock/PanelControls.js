import { Container } from "../../core/render/Container";
import { Button } from "../../core/render/Button";
import { Graphics } from "../../core/render/Graphics";
/**
 * Creates a button set for [[StockChart]] panels (move up/down, close, etc.)
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/panels/#Panel_controls} for more info
 */
export class PanelControls extends Container {
    constructor() {
        super(...arguments);
        /**
         * A [[Button]] which moves panel up.
         *
         * @default Button.new()
         */
        Object.defineProperty(this, "upButton", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Button.new(this._root, {
                themeTags: ["up", "control", "panel"],
                icon: Graphics.new(this._root, {
                    themeTags: ["icon", "button"]
                })
            }))
        });
        /**
         * A [[Button]] which moves panel down.
         *
         * @default Button.new()
         */
        Object.defineProperty(this, "downButton", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Button.new(this._root, {
                themeTags: ["down", "control", "panel"],
                icon: Graphics.new(this._root, {
                    themeTags: ["icon", "button"]
                })
            }))
        });
        /**
         * A [[Button]] which expands/collapses the panel.
         *
         * @default Button.new()
         */
        Object.defineProperty(this, "expandButton", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Button.new(this._root, {
                themeTags: ["expand", "control", "panel"],
                icon: Graphics.new(this._root, {
                    themeTags: ["icon", "button"]
                })
            }))
        });
        /**
         * A [[Button]] which closes the panel.
         *
         * @default Button.new()
         */
        Object.defineProperty(this, "closeButton", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Button.new(this._root, {
                themeTags: ["close", "control", "panel"],
                icon: Graphics.new(this._root, {
                    themeTags: ["icon", "button"]
                })
            }))
        });
    }
    _afterNew() {
        super._afterNew();
        const upButton = this.upButton;
        const downButton = this.downButton;
        downButton.events.on("click", () => {
            const stockPanel = this.get("stockPanel");
            stockPanel.moveDown();
        });
        upButton.events.on("click", () => {
            const stockPanel = this.get("stockPanel");
            stockPanel.moveUp();
        });
        this.closeButton.events.on("click", () => {
            const stockPanel = this.get("stockPanel");
            stockPanel.close();
        });
        this.expandButton.events.on("click", () => {
            const stockPanel = this.get("stockPanel");
            stockPanel.expand();
        });
    }
}
Object.defineProperty(PanelControls, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "PanelControls"
});
Object.defineProperty(PanelControls, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Container.classNames.concat([PanelControls.className])
});
//# sourceMappingURL=PanelControls.js.map