import { __awaiter } from "tslib";
import { Entity } from "../../core/util/Entity";
import { Container } from "../../core/render/Container";
import { Picture } from "../../core/render/Picture";
import * as $utils from "../../core/util/Utils";
import { p100 } from "../../core/util/Percent";
/**
 * A plugin that can be used to annotate charts.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/exporting/annotator/} for more info
 */
export class Annotator extends Entity {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_container", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_picture", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_markerArea", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_skipRender", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    //public extraImages: Array<Root | IAnnotatorImageSource> = [];
    //public dataSources: any[] = [];
    _afterNew() {
        super._afterNew();
        this._setRawDefault("layer", 1000);
        this._root.addDisposer(this);
    }
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("markerState")) {
            this._renderState();
        }
    }
    /**
     * Triggers annotation mode on the chart. This will display UI toolbars and
     * disable all interactions on the chart itself.
     */
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            // Delay this so that it's not knocked off by closing of the ExportingMenu
            this.setTimeout(() => {
                this._root._renderer.interactionsEnabled = false;
            }, 100);
            const markerArea = yield this.getMarkerArea();
            markerArea.show();
            this._picture.hide(0);
            if (this.get("markerState")) {
                markerArea.restoreState(this.get("markerState"));
            }
        });
    }
    _renderState() {
        return __awaiter(this, void 0, void 0, function* () {
            const markerArea = yield this.getMarkerArea();
            if (this.get("markerState")) {
                this._skipRender = true;
                markerArea.renderState(this.get("markerState"));
            }
        });
    }
    /**
     * Exists from annotation mode. All annotations remain visible on the chart.
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            //this._root._renderer.interactionsEnabled = true;
            const markerArea = yield this.getMarkerArea();
            markerArea.close();
            this._markerArea = undefined;
        });
    }
    /**
     * Exits from annotation mode. Any changes made during last session of the
     * annotation editing are cancelled.
     */
    cancel() {
        return __awaiter(this, void 0, void 0, function* () {
            this._root._renderer.interactionsEnabled = true;
            const markerArea = yield this.getMarkerArea();
            this._picture.show(0);
            markerArea.close();
            this._markerArea = undefined;
            //markerArea!.cancel();
        });
    }
    /**
     * All annotations are removed.
     */
    clear() {
        this.set("markerState", undefined);
        if (this._picture) {
            this._picture.set("src", "");
        }
    }
    toggle() {
        return __awaiter(this, void 0, void 0, function* () {
            const markerArea = yield this.getMarkerArea();
            if (markerArea.isOpen) {
                this.close();
            }
            else {
                this.open();
            }
        });
    }
    dispose() {
        super.dispose();
        if (this._markerArea && this._markerArea.isOpen) {
            this._markerArea.close();
        }
    }
    _maybeInit() {
        return __awaiter(this, void 0, void 0, function* () {
            // Create layer canvas
            if (!this._container) {
                this._container = this._root.container.children.push(Container.new(this._root, {
                    width: p100,
                    height: p100,
                    layer: this.get("layer"),
                    interactiveChildren: false
                }));
                this._picture = this._container.children.push(Picture.new(this._root, {
                    width: p100,
                    height: p100
                }));
            }
            // Create MarkerArea
            if (!this._markerArea) {
                const markerjs2 = yield this._getMarkerJS();
                const canvas = this._container._display.getCanvas();
                const markerArea = new markerjs2.MarkerArea(canvas);
                //markerArea.renderTarget = canvas;
                markerArea.uiStyleSettings.logoPosition = "right";
                markerArea.uiStyleSettings.zIndex = 20;
                markerArea.targetRoot = canvas.parentElement;
                this._disposers.push($utils.addEventListener(markerArea, "close", () => {
                    this._root._renderer.interactionsEnabled = true;
                    this._picture.show(0);
                    this._markerArea = undefined;
                }));
                this._disposers.push($utils.addEventListener(markerArea, "render", (event) => {
                    const picture = this._picture;
                    picture.set("src", event.dataUrl);
                    if (!this._skipRender) {
                        this.set("markerState", event.state);
                    }
                    this._skipRender = false;
                }));
                this._markerArea = markerArea;
            }
        });
    }
    /**
     * @ignore
     */
    _getMarkerJS() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield import(/* webpackChunkName: "markerjs2" */ "markerjs2");
        });
    }
    /**
     * An instance of MarkerJS's [[MarkerArea]].
     *
     * @see {@link https://markerjs.com/docs/getting-started} for more info
     * @return MarkerArea
     */
    getMarkerArea() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._maybeInit();
            return this._markerArea;
        });
    }
}
Object.defineProperty(Annotator, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Annotator"
});
Object.defineProperty(Annotator, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Entity.classNames.concat([Annotator.className])
});
//# sourceMappingURL=Annotator.js.map