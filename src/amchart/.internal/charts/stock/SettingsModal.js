import { CandlestickSeries } from "../xy/series/CandlestickSeries";
import { LineSeries } from "../xy/series/LineSeries";
import { Modal } from "../../core/util/Modal";
import { ColorControl } from "./toolbar/ColorControl";
import * as $array from "../../core/util/Array";
import * as $object from "../../core/util/Object";
import * as $utils from "../../core/util/Utils";
import * as $type from "../../core/util/Type";
/**
 * Used to display a modal dialog with HTML content.
 */
export class SettingsModal extends Modal {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_updatedSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_settingsTarget", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_colorControl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _afterNew() {
        super._afterNew();
    }
    _beforeChanged() {
        super._beforeChanged();
        // if (this.isDirty("content")) {
        // 	this.getPrivate("content").innerHTML = this.get("content", "");
        // }
    }
    /**
     * Opens settings modal for an [[Indicator]].
     *
     * @param  target  Target indicator
     */
    openIndicator(target) {
        this._settingsTarget = target;
        this.initContent(target._editableSettings, target);
    }
    /**
     * Opens settings editing for the any [[XYSeries]].
     *
     * @param  series  target series
     */
    openSeries(series) {
        this._settingsTarget = series;
        const l = this._root.language;
        const stockChart = this.get("stockChart");
        const isline = series instanceof LineSeries;
        let settings = [];
        if (series == stockChart.get("stockSeries") && !isline) {
            settings.push({
                id: "stockPositiveColor",
                key: "stockPositiveColor",
                name: l.translateAny("Increase"),
                type: "color",
                currentValue: stockChart.get("stockPositiveColor", this._root.interfaceColors.get("positive")),
                target: stockChart
            });
            settings.push({
                id: "stockNegativeColor",
                key: "stockNegativeColor",
                name: l.translateAny("Decrease"),
                type: "color",
                currentValue: stockChart.get("stockNegativeColor", this._root.interfaceColors.get("negative")),
                target: stockChart
            });
        }
        else if (series == stockChart.get("volumeSeries") && !isline) {
            settings.push({
                id: "volumePositiveColor",
                key: "volumePositiveColor",
                name: l.translateAny("Increase"),
                type: "color",
                currentValue: stockChart.get("volumePositiveColor", this._root.interfaceColors.get("positive")),
                target: stockChart
            });
            settings.push({
                id: "volumeNegativeColor",
                key: "volumeNegativeColor",
                name: l.translateAny("Decrease"),
                type: "color",
                currentValue: stockChart.get("volumeNegativeColor", this._root.interfaceColors.get("negative")),
                target: stockChart
            });
        }
        else if (series instanceof CandlestickSeries && series.columns.length) {
            const column = series.columns.getIndex(0);
            settings.push({
                id: "riseFromOpen.fill",
                key: "fill",
                additionalKeys: ["stroke"],
                name: l.translateAny("Increase"),
                type: "color",
                currentValue: column.states.lookup("riseFromOpen").get("fill"),
                target: series.columns.template.states.create("riseFromOpen", {}),
                invalidateTarget: series
            });
            settings.push({
                id: "dropFromOpen.fill",
                key: "fill",
                additionalKeys: ["stroke"],
                name: l.translateAny("Decrease"),
                type: "color",
                currentValue: column.states.lookup("dropFromOpen").get("fill"),
                target: series.columns.template.states.create("dropFromOpen", {}),
                invalidateTarget: series
            });
        }
        else if (isline) {
            settings = [{
                    key: "stroke",
                    name: l.translateAny("Line"),
                    type: "color",
                    additionalKeys: ["fill"],
                    target: series,
                }, {
                    key: "strokeWidth",
                    name: l.translateAny("Line"),
                    type: "dropdown",
                    options: [
                        { value: 1, text: "1px" },
                        { value: 2, text: "2px" },
                        { value: 4, text: "4px" },
                        { value: 10, text: "10px" }
                    ],
                    currentValue: series.strokes.template.get("strokeWidth", 1),
                    target: series.strokes.template,
                    invalidateTarget: series
                }];
            if (series.fills.template.get("visible")) {
                settings.push({
                    key: "fill",
                    name: l.translateAny("Fill"),
                    type: "color"
                });
            }
        }
        else {
            settings = [{
                    key: "stroke",
                    name: l.translateAny("Line"),
                    type: "color"
                }, {
                    key: "fill",
                    name: l.translateAny("Fill"),
                    type: "color"
                }];
        }
        this.initContent(settings, series);
    }
    initContent(settings, target) {
        this._updatedSettings = {};
        const content = this.getPrivate("content");
        // Clear
        this.clear();
        // Title
        const title = document.createElement("h1");
        title.innerHTML = target.get("name");
        content.appendChild(title);
        // Add fields
        const table = document.createElement("div");
        table.className = "am5-modal-table";
        content.appendChild(table);
        const settingInputs = {};
        const settingsWithTarget = {};
        let prevName = "";
        let prevLine;
        $array.each(settings, (setting) => {
            const key = this._getSettingKey(setting);
            const keyTarget = setting.target || target;
            const currentValue = setting.currentValue || keyTarget.get(setting.key);
            if (setting.target) {
                settingsWithTarget[key] = setting;
            }
            let element;
            switch (setting.type) {
                case "dropdown":
                    element = this.getDropdown(setting, currentValue);
                    settingInputs[key] = element;
                    break;
                case "number":
                    element = this.getNumber(setting, currentValue);
                    settingInputs[key] = element;
                    break;
                case "color":
                    element = this.getColor(setting, currentValue);
                    break;
                case "checkbox":
                    element = this.getCheckbox(setting, currentValue);
                    settingInputs[key] = element;
                    break;
                // case "text":
                // 	element = this.getText(setting, currentValue);
                // 	break;
            }
            if (element) {
                let line;
                if (setting.name == prevName && prevLine) {
                    line = prevLine;
                }
                else {
                    line = document.createElement("div");
                    line.className = "am5-modal-table-row";
                    table.appendChild(line);
                    const heading = document.createElement("div");
                    heading.className = "am5-modal-table-heading";
                    heading.innerHTML = setting.name;
                    line.appendChild(heading);
                }
                const cell = document.createElement("div");
                cell.className = "am5-modal-table-cell";
                line.appendChild(cell);
                cell.appendChild(element);
                prevName = setting.name;
                prevLine = line;
            }
        });
        // Buttons
        const saveButton = document.createElement("input");
        saveButton.type = "button";
        saveButton.value = this._root.language.translateAny("Save");
        saveButton.className = "am5-modal-button am5-modal-primary";
        content.appendChild(saveButton);
        this._disposers.push($utils.addEventListener(saveButton, "click", () => {
            $object.each(settingInputs, (key, element) => {
                if (element.type == "checkbox") {
                    this._updatedSettings[key] = element.checked;
                }
                else if (element.type == "number") {
                    this._updatedSettings[key] = $type.toNumber(element.value);
                }
                else {
                    this._updatedSettings[key] = element.value;
                }
            });
            $object.each(this._updatedSettings, (key, value) => {
                const targetKey = key.split(".").pop();
                if ($type.isObject(value) && value.value) {
                    if (value.setting && value.setting.target) {
                        value.setting.target.set(targetKey, value.value);
                        if (value.setting.additionalKeys) {
                            $array.each(value.setting.additionalKeys, (additionalKey) => {
                                value.setting.target.set(additionalKey, value.value);
                            });
                        }
                    }
                    else {
                        target.set(targetKey, value.value);
                    }
                }
                else if (settingsWithTarget[targetKey]) {
                    settingsWithTarget[targetKey].target.set(targetKey, value);
                }
                else {
                    target.set(targetKey, value);
                }
                if (value.setting && value.setting.invalidateTarget) {
                    value.setting.invalidateTarget.markDirtyValues();
                }
            });
            this.close();
        }));
        const cancelButton = document.createElement("input");
        cancelButton.type = "button";
        cancelButton.value = this._root.language.translateAny("Cancel");
        cancelButton.className = "am5-modal-button am5-modal-scondary";
        content.appendChild(cancelButton);
        this._disposers.push($utils.addEventListener(cancelButton, "click", () => {
            this.cancel();
        }));
        // Open modal
        this.open();
    }
    getDropdown(setting, currentValue) {
        const element = document.createElement("select");
        $array.each(setting.options, (option) => {
            if (option) {
                const optionElement = document.createElement("option");
                let value;
                if ($type.isObject(option)) {
                    optionElement.value = (option.value);
                    optionElement.text = (option.text);
                    value = (option.value);
                }
                else {
                    optionElement.value = option;
                    optionElement.text = option;
                    value = option;
                }
                if (value == currentValue) {
                    optionElement.selected = true;
                }
                element.appendChild(optionElement);
            }
        });
        return element;
    }
    getNumber(_setting, currentValue) {
        const element = document.createElement("input");
        element.type = "number";
        element.value = currentValue;
        element.className = "am5-modal-input-narrow";
        return element;
    }
    getCheckbox(_setting, currentValue) {
        const element = document.createElement("input");
        element.type = "checkbox";
        element.checked = currentValue === true;
        return element;
    }
    getColor(setting, currentValue) {
        const control = ColorControl.new(this.root, {
            stockChart: this.get("stockChart"),
            useOpacity: false
        });
        control.setPrivate("color", currentValue);
        control.events.on("selected", (ev) => {
            this._updatedSettings[this._getSettingKey(setting)] = {
                value: ev.color,
                setting: setting
            };
        });
        this._disposers.push(control);
        return control.getPrivate("button");
    }
    /**
     * Closes the modal, saving settings.
     */
    close() {
        super.close();
        this.events.dispatch("done", {
            type: "done",
            settings: this._updatedSettings,
            settingsTarget: this._settingsTarget,
            target: this
        });
    }
    /**
     * Closes the modal without applying any changes.
     */
    cancel() {
        super.cancel();
        this.events.dispatch("done", {
            type: "done",
            settings: null,
            target: this
        });
    }
    /**
     * Clears contents of the modal.
     */
    clear() {
        const content = this.getPrivate("content");
        content.innerHTML = "";
        if (this._colorControl) {
            this._colorControl.dispose();
        }
    }
    _getSettingKey(setting) {
        return setting.id || setting.key;
    }
}
Object.defineProperty(SettingsModal, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "SettingsModal"
});
Object.defineProperty(SettingsModal, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Modal.classNames.concat([Modal.className])
});
//# sourceMappingURL=SettingsModal.js.map