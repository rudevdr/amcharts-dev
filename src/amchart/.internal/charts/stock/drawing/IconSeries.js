import { PolylineSeries } from "./PolylineSeries";
import { Bullet } from "../../../core/render/Bullet";
import { Graphics } from "../../../core/render/Graphics";
import { SpriteResizer } from "../../../core/render/SpriteResizer";
import { Template } from "../../../core/util/Template";
import * as $array from "../../../core/util/Array";
export class IconSeries extends PolylineSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "spriteResizer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(SpriteResizer.new(this._root, {}))
        });
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "icon"
        });
    }
    _afterNew() {
        super._afterNew();
        this.bullets.clear();
        this.strokes.template.set("visible", false);
        this.fills.template.set("visible", false);
        this.bullets.push((root, _series, dataItem) => {
            const dataContext = dataItem.dataContext;
            const template = dataContext.settings;
            const sprite = Graphics.new(root, {
                draggable: true,
                themeTags: ["icon"]
            }, template);
            this._addBulletInteraction(sprite);
            sprite.events.on("click", () => {
                const spriteResizer = this.spriteResizer;
                if (spriteResizer.get("sprite") == sprite) {
                    spriteResizer.set("sprite", undefined);
                }
                else {
                    spriteResizer.set("sprite", sprite);
                }
            });
            sprite.events.on("pointerover", () => {
                this._isHover = true;
            });
            sprite.events.on("pointerout", () => {
                this._isHover = false;
            });
            this.spriteResizer.set("sprite", undefined);
            sprite.on("scale", (scale) => {
                template.set("scale", scale);
            });
            sprite.on("rotation", (rotation) => {
                template.set("rotation", rotation);
            });
            return Bullet.new(this._root, {
                locationX: undefined,
                sprite: sprite
            });
        });
    }
    _handlePointerClick(event) {
        if (this._drawingEnabled) {
            if (!this._isHover) {
                super._handlePointerClick(event);
                const dataObject = this.data.getIndex(this.data.length - 1);
                dataObject.settings = this._getIconTemplate();
                this._index++;
                this._di[this._index] = {};
            }
        }
    }
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        this.spriteResizer.set("sprite", undefined);
        this._isHover = false;
    }
    _hideAllBullets() {
    }
    _getIconTemplate() {
        const template = {};
        const iconSvgPath = this.get("iconSvgPath");
        if (iconSvgPath != null) {
            template.svgPath = iconSvgPath;
        }
        const iconScale = this.get("iconScale");
        if (iconScale != null) {
            template.scale = iconScale;
        }
        const iconCenterX = this.get("iconCenterX");
        if (iconCenterX != null) {
            template.centerX = iconCenterX;
        }
        const iconCenterY = this.get("iconCenterY");
        if (iconCenterY != null) {
            template.centerY = iconCenterY;
        }
        const strokeColor = this.get("strokeColor");
        if (strokeColor != null) {
            template.stroke = strokeColor;
        }
        const strokeOpacity = this.get("strokeOpacity");
        if (strokeOpacity != null) {
            template.strokeOpacity = strokeOpacity;
        }
        const fillColor = this.get("fillColor");
        if (fillColor != null) {
            template.fill = fillColor;
        }
        const fillOpacity = this.get("fillOpacity");
        if (fillOpacity != null) {
            template.fillOpacity = fillOpacity;
        }
        return Template.new(template);
    }
    setInteractive(value) {
        super.setInteractive(value);
        $array.each(this.dataItems, (dataItem) => {
            const bullets = dataItem.bullets;
            if (bullets) {
                $array.each(bullets, (bullet) => {
                    const sprite = bullet.get("sprite");
                    if (sprite) {
                        sprite.set("forceInactive", !value);
                    }
                });
            }
        });
    }
}
Object.defineProperty(IconSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "IconSeries"
});
Object.defineProperty(IconSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PolylineSeries.classNames.concat([IconSeries.className])
});
//# sourceMappingURL=IconSeries.js.map