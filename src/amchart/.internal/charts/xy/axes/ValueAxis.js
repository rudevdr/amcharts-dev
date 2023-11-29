import { DataItem } from "../../../core/render/Component";
import { Axis } from "./Axis";
import { MultiDisposer } from "../../../core/util/Disposer";
import * as $type from "../../../core/util/Type";
import * as $array from "../../../core/util/Array";
import * as $math from "../../../core/util/Math";
import * as $utils from "../../../core/util/Utils";
/**
 * Creates a value axis.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/} for more info
 * @important
 */
export class ValueAxis extends Axis {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_dirtyExtremes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_dirtySelectionExtremes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_deltaMinMax", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "_minReal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_maxReal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_baseValue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_syncDp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_minLogAdjusted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
    }
    /**
     * @ignore
     */
    markDirtyExtremes() {
        this._dirtyExtremes = true;
        this.markDirty();
    }
    /**
     * @ignore
     */
    markDirtySelectionExtremes() {
        this._dirtySelectionExtremes = true;
        this.markDirty();
    }
    _afterNew() {
        this._settings.themeTags = $utils.mergeTags(this._settings.themeTags, ["axis"]);
        this.setPrivateRaw("name", "value");
        this.addTag("value");
        super._afterNew();
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this.isDirty("syncWithAxis")) {
            let previousValue = this._prevSettings.syncWithAxis;
            if (previousValue) {
                if (this._syncDp) {
                    this._syncDp.dispose();
                }
            }
            let syncWithAxis = this.get("syncWithAxis");
            if (syncWithAxis) {
                this._syncDp = new MultiDisposer([
                    syncWithAxis.onPrivate("selectionMinFinal", () => {
                        this._dirtySelectionExtremes = true;
                    }),
                    syncWithAxis.onPrivate("selectionMaxFinal", () => {
                        this._dirtySelectionExtremes = true;
                    })
                ]);
            }
        }
        let someDirty = false;
        if (this.isDirty("min") || this.isDirty("max") || this.isDirty("maxPrecision") || this.isDirty("numberFormat")) {
            someDirty = true;
            this.ghostLabel.set("text", "");
        }
        //if (this._dirtyExtremes || this.isPrivateDirty("width") || this.isPrivateDirty("height") || this.isDirty("min") || this.isDirty("max") || this.isDirty("extraMin") || this.isDirty("extraMax") || this.isDirty("logarithmic") || this.isDirty("treatZeroAs") || this.isDirty("baseValue") || this.isDirty("strictMinMax") || this.isDirty("maxPrecision")) {
        if (this._sizeDirty || this._dirtyExtremes || this._valuesDirty || someDirty || this.isPrivateDirty("width") || this.isPrivateDirty("height") || this.isDirty("extraMin") || this.isDirty("extraMax") || this.isDirty("logarithmic") || this.isDirty("treatZeroAs") || this.isDirty("baseValue") || this.isDirty("strictMinMax") || this.isDirty("strictMinMaxSelection")) {
            this._getMinMax();
            this._dirtyExtremes = false;
        }
        if (this._dirtySelectionExtremes && !this._isPanning && this.get("autoZoom", true)) {
            this._getSelectionMinMax();
            this._dirtySelectionExtremes = false;
        }
        this._groupData();
        if (this._sizeDirty || this._valuesDirty || this.isDirty("start") || this.isDirty("end") || this.isPrivateDirty("min") || this.isPrivateDirty("selectionMax") || this.isPrivateDirty("selectionMin") || this.isPrivateDirty("max") || this.isPrivateDirty("step") || this.isPrivateDirty("width") || this.isPrivateDirty("height") || this.isDirty("logarithmic")) {
            this._handleRangeChange();
            this._prepareAxisItems();
            this._updateAxisRanges();
        }
        this._baseValue = this.baseValue();
    }
    _groupData() {
    }
    _formatText(value) {
        const numberFormat = this.get("numberFormat");
        const formatter = this.getNumberFormatter();
        let text = "";
        if (numberFormat) {
            text = formatter.format(value, numberFormat);
        }
        else {
            text = formatter.format(value, undefined, this.getPrivate("stepDecimalPlaces"));
        }
        return text;
    }
    _prepareAxisItems() {
        const min = this.getPrivate("min");
        const max = this.getPrivate("max");
        if ($type.isNumber(min) && $type.isNumber(max)) {
            const logarithmic = this.get("logarithmic");
            const step = this.getPrivate("step");
            const selectionMin = this.getPrivate("selectionMin");
            const selectionMax = this.getPrivate("selectionMax") + step;
            let value = selectionMin - step;
            let differencePower = 1;
            let minLog = min;
            if (logarithmic) {
                value = this._minLogAdjusted;
                if (value < selectionMin) {
                    while (value < selectionMin) {
                        value += step;
                    }
                }
                minLog = value;
                if (minLog <= 0) {
                    minLog = 1;
                    if (step < 1) {
                        minLog = step;
                    }
                }
                differencePower = Math.log(selectionMax - step) * Math.LOG10E - Math.log(minLog) * Math.LOG10E;
                if (differencePower > 2) {
                    value = Math.pow(10, Math.log(minLog) * Math.LOG10E - 5);
                }
            }
            /// minor grid
            const renderer = this.get("renderer");
            const minorLabelsEnabled = renderer.get("minorLabelsEnabled");
            const minorGridEnabled = renderer.get("minorGridEnabled", minorLabelsEnabled);
            let stepPower = Math.pow(10, Math.floor(Math.log(Math.abs(step)) * Math.LOG10E));
            const stepAdjusted = Math.round(step / stepPower);
            let minorGridCount = 2;
            if ($math.round(stepAdjusted / 5, 10) % 1 == 0) {
                minorGridCount = 5;
            }
            if ($math.round(stepAdjusted / 10, 10) % 1 == 0) {
                minorGridCount = 10;
            }
            let minorStep = step / minorGridCount;
            // end of minor grid
            let i = 0;
            let m = 0;
            let previous = -Infinity;
            while (value < selectionMax) {
                let dataItem;
                if (this.dataItems.length < i + 1) {
                    dataItem = new DataItem(this, undefined, {});
                    this._dataItems.push(dataItem);
                    this.processDataItem(dataItem);
                }
                else {
                    dataItem = this.dataItems[i];
                }
                this._createAssets(dataItem, []);
                this._toggleDataItem(dataItem, true);
                dataItem.setRaw("value", value);
                const label = dataItem.get("label");
                if (label) {
                    label.set("text", this._formatText(value));
                }
                this._prepareDataItem(dataItem);
                let nextValue = value;
                if (!logarithmic) {
                    nextValue += step;
                }
                else {
                    if (differencePower > 2) {
                        nextValue = Math.pow(10, Math.log(minLog) * Math.LOG10E + i - 5);
                    }
                    else {
                        nextValue += step;
                    }
                }
                // minor grid
                if (minorGridEnabled) {
                    let minorValue = value + minorStep;
                    if (logarithmic) {
                        if (differencePower > 2) {
                            let minorMinMaxStep = this._adjustMinMax(value, nextValue, 10);
                            minorStep = minorMinMaxStep.step;
                        }
                        minorValue = value + minorStep;
                    }
                    while (minorValue < nextValue - step * 0.00000000001) {
                        let minorDataItem;
                        if (this.minorDataItems.length < m + 1) {
                            minorDataItem = new DataItem(this, undefined, {});
                            this.minorDataItems.push(minorDataItem);
                            this.processDataItem(minorDataItem);
                        }
                        else {
                            minorDataItem = this.minorDataItems[m];
                        }
                        this._createAssets(minorDataItem, ["minor"], true);
                        this._toggleDataItem(minorDataItem, true);
                        minorDataItem.setRaw("value", minorValue);
                        const minorLabel = minorDataItem.get("label");
                        if (minorLabel) {
                            if (minorLabelsEnabled) {
                                minorLabel.set("text", this._formatText(minorValue));
                            }
                            else {
                                minorLabel.setPrivate("visible", false);
                            }
                        }
                        this._prepareDataItem(minorDataItem);
                        minorValue += minorStep;
                        m++;
                    }
                }
                value = nextValue;
                if (previous == value) {
                    break;
                }
                let stepPower = Math.pow(10, Math.floor(Math.log(Math.abs(step)) * Math.LOG10E));
                if (stepPower < 1) {
                    // exponent is less then 1 too. Count decimals of exponent
                    let decCount = Math.round(Math.abs(Math.log(Math.abs(stepPower)) * Math.LOG10E)) + 2;
                    // round value to avoid floating point issues
                    value = $math.round(value, decCount);
                }
                i++;
                previous = value;
            }
            for (let j = i; j < this.dataItems.length; j++) {
                this._toggleDataItem(this.dataItems[j], false);
            }
            for (let j = m; j < this.minorDataItems.length; j++) {
                this._toggleDataItem(this.minorDataItems[j], false);
            }
            $array.each(this.series, (series) => {
                if (series.inited) {
                    series._markDirtyAxes();
                }
            });
            this._updateGhost();
        }
    }
    _prepareDataItem(dataItem, count) {
        let renderer = this.get("renderer");
        let value = dataItem.get("value");
        let endValue = dataItem.get("endValue");
        let position = this.valueToPosition(value);
        let endPosition = position;
        let fillEndPosition = this.valueToPosition(value + this.getPrivate("step"));
        if ($type.isNumber(endValue)) {
            endPosition = this.valueToPosition(endValue);
            fillEndPosition = endPosition;
        }
        if (dataItem.get("isRange")) {
            if (endValue == null) {
                fillEndPosition = position;
            }
        }
        let labelEndPosition = endPosition;
        let labelEndValue = dataItem.get("labelEndValue");
        if (labelEndValue != null) {
            labelEndPosition = this.valueToPosition(labelEndValue);
        }
        renderer.updateLabel(dataItem.get("label"), position, labelEndPosition, count);
        const grid = dataItem.get("grid");
        renderer.updateGrid(grid, position, endPosition);
        if (grid) {
            if (value == this.get("baseValue", 0)) {
                grid.addTag("base");
                grid._applyThemes();
            }
            else if (grid.hasTag("base")) {
                grid.removeTag("base");
                grid._applyThemes();
            }
        }
        renderer.updateTick(dataItem.get("tick"), position, endPosition, count);
        renderer.updateFill(dataItem.get("axisFill"), position, fillEndPosition);
        this._processBullet(dataItem);
        renderer.updateBullet(dataItem.get("bullet"), position, endPosition);
        if (!dataItem.get("isRange")) {
            const fillRule = this.get("fillRule");
            if (fillRule) {
                fillRule(dataItem);
            }
        }
    }
    _handleRangeChange() {
        let selectionMin = this.positionToValue(this.get("start", 0));
        let selectionMax = this.positionToValue(this.get("end", 1));
        const gridCount = this.get("renderer").gridCount();
        let minMaxStep = this._adjustMinMax(selectionMin, selectionMax, gridCount, true);
        let stepDecimalPlaces = $utils.decimalPlaces(minMaxStep.step);
        this.setPrivateRaw("stepDecimalPlaces", stepDecimalPlaces);
        selectionMin = $math.round(selectionMin, stepDecimalPlaces);
        selectionMax = $math.round(selectionMax, stepDecimalPlaces);
        minMaxStep = this._adjustMinMax(selectionMin, selectionMax, gridCount, true);
        let step = minMaxStep.step;
        selectionMin = minMaxStep.min;
        selectionMax = minMaxStep.max;
        if (this.getPrivate("selectionMin") !== selectionMin || this.getPrivate("selectionMax") !== selectionMax || this.getPrivate("step") !== step) {
            // do not change to setPrivate, will cause SO
            this.setPrivateRaw("selectionMin", selectionMin);
            this.setPrivateRaw("selectionMax", selectionMax);
            this.setPrivateRaw("step", step);
        }
    }
    /**
     * Converts a relative position to a corresponding numeric value from axis
     * scale.
     *
     * @param   position  Relative position
     * @return            Value
     */
    positionToValue(position) {
        const min = this.getPrivate("min");
        const max = this.getPrivate("max");
        if (!this.get("logarithmic")) {
            return position * (max - min) + min;
        }
        else {
            return Math.pow(Math.E, (position * ((Math.log(max) * Math.LOG10E - Math.log(min) * Math.LOG10E)) + Math.log(min) * Math.LOG10E) / Math.LOG10E);
        }
    }
    /**
     * Convers value to a relative position on axis.
     *
     * @param   value  Value
     * @return         Relative position
     */
    valueToPosition(value) {
        const min = this.getPrivate("min");
        const max = this.getPrivate("max");
        if (!this.get("logarithmic")) {
            return (value - min) / (max - min);
        }
        else {
            if (value <= 0) {
                let treatZeroAs = this.get("treatZeroAs");
                if ($type.isNumber(treatZeroAs)) {
                    value = treatZeroAs;
                }
            }
            return (Math.log(value) * Math.LOG10E - Math.log(min) * Math.LOG10E) / ((Math.log(max) * Math.LOG10E - Math.log(min) * Math.LOG10E));
        }
    }
    /**
     * @ignore
     */
    valueToFinalPosition(value) {
        const min = this.getPrivate("minFinal");
        const max = this.getPrivate("maxFinal");
        if (!this.get("logarithmic")) {
            return (value - min) / (max - min);
        }
        else {
            if (value <= 0) {
                let treatZeroAs = this.get("treatZeroAs");
                if ($type.isNumber(treatZeroAs)) {
                    value = treatZeroAs;
                }
            }
            return (Math.log(value) * Math.LOG10E - Math.log(min) * Math.LOG10E) / ((Math.log(max) * Math.LOG10E - Math.log(min) * Math.LOG10E));
        }
    }
    /**
     * Returns X coordinate in pixels corresponding to specific value.
     *
     * @param   value     Numeric value
     * @param   location  Location
     * @param   baseValue Base value
     * @return            X coordinate
     */
    getX(value, location, baseValue) {
        value = baseValue + (value - baseValue) * location;
        const position = this.valueToPosition(value);
        return this._settings.renderer.positionToCoordinate(position);
    }
    /**
     * Returns X coordinate in pixels corresponding to specific value.
     *
     * @param   value     Numeric value
     * @param   location  Location
     * @param   baseValue Base value
     * @return            X coordinate
     */
    getY(value, location, baseValue) {
        value = baseValue + (value - baseValue) * location;
        const position = this.valueToPosition(value);
        return this._settings.renderer.positionToCoordinate(position);
    }
    /**
     * @ignore
     */
    getDataItemCoordinateX(dataItem, field, _cellLocation, axisLocation) {
        return this._settings.renderer.positionToCoordinate(this.getDataItemPositionX(dataItem, field, _cellLocation, axisLocation));
    }
    /**
     * @ignore
     */
    getDataItemPositionX(dataItem, field, _cellLocation, axisLocation) {
        let value = dataItem.get(field);
        const stackToItem = dataItem.get("stackToItemX");
        if (stackToItem) {
            const series = dataItem.component;
            value = value * axisLocation + series.getStackedXValueWorking(dataItem, field);
        }
        else {
            value = this._baseValue + (value - this._baseValue) * axisLocation;
        }
        return this.valueToPosition(value);
    }
    /**
     * @ignore
     */
    getDataItemCoordinateY(dataItem, field, _cellLocation, axisLocation) {
        return this._settings.renderer.positionToCoordinate(this.getDataItemPositionY(dataItem, field, _cellLocation, axisLocation));
    }
    /**
     * @ignore
     */
    getDataItemPositionY(dataItem, field, _cellLocation, axisLocation) {
        let value = dataItem.get(field);
        const stackToItem = dataItem.get("stackToItemY");
        if (stackToItem) {
            const series = dataItem.component;
            value = value * axisLocation + series.getStackedYValueWorking(dataItem, field);
        }
        else {
            value = this._baseValue + (value - this._baseValue) * axisLocation;
        }
        return this.valueToPosition(value);
    }
    /**
     * Returns relative position of axis' `baseValue`.
     *
     * @return  Base value position
     */
    basePosition() {
        return this.valueToPosition(this.baseValue());
    }
    /**
     * Base value of the [[ValueAxis]], which determines positive and negative
     * values.
     *
     * @return Base value
     */
    baseValue() {
        const min = Math.min(this.getPrivate("minFinal", -Infinity), this.getPrivate("selectionMin", -Infinity));
        const max = Math.max(this.getPrivate("maxFinal", Infinity), this.getPrivate("selectionMax", Infinity));
        let baseValue = this.get("baseValue", 0);
        if (baseValue < min) {
            baseValue = min;
        }
        if (baseValue > max) {
            baseValue = max;
        }
        return baseValue;
    }
    /**
     * @ignore
     */
    cellEndValue(value) {
        return value;
    }
    fixSmallStep(step) {
        // happens because of floating point error
        if (1 + step === 1) {
            step *= 2;
            return this.fixSmallStep(step);
        }
        return step;
    }
    _fixMin(min) {
        return min;
    }
    _fixMax(max) {
        return max;
    }
    _calculateTotals() {
        if (this.get("calculateTotals")) {
            let series = this.series[0];
            if (series) {
                let startIndex = series.startIndex();
                if (series.dataItems.length > 0) {
                    if (startIndex > 0) {
                        startIndex--;
                    }
                    let endIndex = series.endIndex();
                    if (endIndex < series.dataItems.length) {
                        endIndex++;
                    }
                    let field;
                    let vc;
                    if (series.get("yAxis") == this) {
                        field = "valueY";
                        vc = "vcy";
                    }
                    else if (series.get("xAxis") == this) {
                        field = "valueX";
                        vc = "vcx";
                    }
                    let fieldWorking = field + "Working";
                    if (field) {
                        for (let i = startIndex; i < endIndex; i++) {
                            let sum = 0;
                            let total = 0;
                            $array.each(this.series, (series) => {
                                if (!series.get("excludeFromTotal")) {
                                    let dataItem = series.dataItems[i];
                                    if (dataItem) {
                                        let value = dataItem.get(fieldWorking) * series.get(vc);
                                        if (!$type.isNaN(value)) {
                                            sum += value;
                                            total += Math.abs(value);
                                        }
                                    }
                                }
                            });
                            $array.each(this.series, (series) => {
                                if (!series.get("excludeFromTotal")) {
                                    let dataItem = series.dataItems[i];
                                    if (dataItem) {
                                        let value = dataItem.get(fieldWorking) * series.get(vc);
                                        if (!$type.isNaN(value)) {
                                            dataItem.set((field + "Total"), total);
                                            dataItem.set((field + "Sum"), sum);
                                            dataItem.set((field + "TotalPercent"), value / total * 100);
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
    }
    _getSelectionMinMax() {
        const min = this.getPrivate("minFinal");
        const max = this.getPrivate("maxFinal");
        const minDefined = this.get("min");
        const maxDefined = this.get("max");
        let extraMin = this.get("extraMin", 0);
        let extraMax = this.get("extraMax", 0);
        if (this.get("logarithmic")) {
            if (this.get("extraMin") == null) {
                extraMin = 0.1;
            }
            if (this.get("extraMax") == null) {
                extraMax = 0.2;
            }
        }
        const gridCount = this.get("renderer").gridCount();
        const selectionStrictMinMax = this.get("strictMinMaxSelection");
        const strictMinMax = this.get("strictMinMax");
        if ($type.isNumber(min) && $type.isNumber(max)) {
            let selectionMin = max;
            let selectionMax = min;
            $array.each(this.series, (series) => {
                if (!series.get("ignoreMinMax")) {
                    let seriesMin;
                    let seriesMax;
                    const outOfSelection = series.getPrivate("outOfSelection");
                    if (series.get("xAxis") === this) {
                        if (!outOfSelection) {
                            let minX = series.getPrivate("minX");
                            let maxX = series.getPrivate("maxX");
                            // solves #90085
                            if (series.startIndex() != 0 || series.endIndex() != series.dataItems.length) {
                                minX = undefined;
                                maxX = undefined;
                            }
                            seriesMin = series.getPrivate("selectionMinX", minX);
                            seriesMax = series.getPrivate("selectionMaxX", maxX);
                        }
                    }
                    else if (series.get("yAxis") === this) {
                        if (!outOfSelection) {
                            let minY = series.getPrivate("minY");
                            let maxY = series.getPrivate("maxY");
                            // solves #90085
                            if (series.startIndex() != 0 || series.endIndex() != series.dataItems.length) {
                                minY = undefined;
                                maxY = undefined;
                            }
                            seriesMin = series.getPrivate("selectionMinY", minY);
                            seriesMax = series.getPrivate("selectionMaxY", maxY);
                        }
                    }
                    if (!series.isHidden() && !series.isShowing()) {
                        if ($type.isNumber(seriesMin)) {
                            selectionMin = Math.min(selectionMin, seriesMin);
                        }
                        if ($type.isNumber(seriesMax)) {
                            selectionMax = Math.max(selectionMax, seriesMax);
                        }
                    }
                }
            });
            this.axisRanges.each((range) => {
                if (range.get("affectsMinMax")) {
                    let value = range.get("value");
                    if (value != null) {
                        selectionMin = Math.min(selectionMin, value);
                        selectionMax = Math.max(selectionMax, value);
                    }
                    value = range.get("endValue");
                    if (value != null) {
                        selectionMin = Math.min(selectionMin, value);
                        selectionMax = Math.max(selectionMax, value);
                    }
                }
            });
            if (selectionMin > selectionMax) {
                [selectionMin, selectionMax] = [selectionMax, selectionMin];
            }
            if ($type.isNumber(minDefined)) {
                if (strictMinMax) {
                    selectionMin = minDefined;
                }
                else {
                    selectionMin = min;
                }
            }
            else if (strictMinMax) {
                if ($type.isNumber(this._minReal)) {
                    selectionMin = this._minReal;
                }
            }
            if ($type.isNumber(maxDefined)) {
                if (strictMinMax) {
                    selectionMax = maxDefined;
                }
                else {
                    selectionMax = max;
                }
            }
            else if (strictMinMax) {
                if ($type.isNumber(this._maxReal)) {
                    selectionMax = this._maxReal;
                }
            }
            if (selectionMin === selectionMax) {
                selectionMin -= this._deltaMinMax;
                selectionMax += this._deltaMinMax;
                let minMaxStep2 = this._adjustMinMax(selectionMin, selectionMax, gridCount, strictMinMax);
                selectionMin = minMaxStep2.min;
                selectionMax = minMaxStep2.max;
            }
            let selectionMinReal = selectionMin;
            let selectionMaxReal = selectionMax;
            selectionMin -= (selectionMax - selectionMin) * extraMin;
            selectionMax += (selectionMax - selectionMin) * extraMax;
            let minMaxStep = this._adjustMinMax(selectionMin, selectionMax, gridCount);
            selectionMin = minMaxStep.min;
            selectionMax = minMaxStep.max;
            selectionMin = $math.fitToRange(selectionMin, min, max);
            selectionMax = $math.fitToRange(selectionMax, min, max);
            // do it for the second time !important			
            minMaxStep = this._adjustMinMax(selectionMin, selectionMax, gridCount, true);
            if (!strictMinMax) {
                selectionMin = minMaxStep.min;
                selectionMax = minMaxStep.max;
            }
            const syncWithAxis = this.get("syncWithAxis");
            if (syncWithAxis) {
                minMaxStep = this._syncAxes(selectionMin, selectionMax, minMaxStep.step, syncWithAxis.getPrivate("selectionMinFinal", syncWithAxis.getPrivate("minFinal", 0)), syncWithAxis.getPrivate("selectionMaxFinal", syncWithAxis.getPrivate("maxFinal", 1)), syncWithAxis.getPrivate("selectionStepFinal", syncWithAxis.getPrivate("step", 1)));
                selectionMin = minMaxStep.min;
                selectionMax = minMaxStep.max;
            }
            if (strictMinMax) {
                if ($type.isNumber(minDefined)) {
                    selectionMin = Math.max(selectionMin, minDefined);
                }
                if ($type.isNumber(maxDefined)) {
                    selectionMax = Math.min(selectionMax, maxDefined);
                }
            }
            if (selectionStrictMinMax) {
                selectionMin = selectionMinReal - (selectionMax - selectionMin) * extraMin;
                selectionMax = selectionMaxReal + (selectionMax - selectionMin) * extraMax;
            }
            if (this.get("logarithmic")) {
                if (selectionMin <= 0) {
                    selectionMin = selectionMinReal * (1 - Math.min(extraMin, 0.99));
                }
                if (selectionMin < min) {
                    selectionMin = min;
                }
                if (selectionMax > max) {
                    selectionMax = max;
                }
            }
            let len = Math.min(20, Math.ceil(Math.log(this.getPrivate("maxZoomFactor", 100) + 1) / Math.LN10) + 2);
            let start = $math.round(this.valueToFinalPosition(selectionMin), len);
            let end = $math.round(this.valueToFinalPosition(selectionMax), len);
            this.setPrivateRaw("selectionMinFinal", selectionMin);
            this.setPrivateRaw("selectionMaxFinal", selectionMax);
            this.setPrivateRaw("selectionStepFinal", minMaxStep.step);
            this.zoom(start, end);
        }
    }
    _getMinMax() {
        let minDefined = this.get("min");
        let maxDefined = this.get("max");
        let min = Infinity;
        let max = -Infinity;
        let extraMin = this.get("extraMin", 0);
        let extraMax = this.get("extraMax", 0);
        if (this.get("logarithmic")) {
            if (this.get("extraMin") == null) {
                extraMin = 0.1;
            }
            if (this.get("extraMax") == null) {
                extraMax = 0.2;
            }
        }
        let minDiff = Infinity;
        $array.each(this.series, (series) => {
            if (!series.get("ignoreMinMax")) {
                let seriesMin;
                let seriesMax;
                if (series.get("xAxis") === this) {
                    seriesMin = series.getPrivate("minX");
                    seriesMax = series.getPrivate("maxX");
                }
                else if (series.get("yAxis") === this) {
                    seriesMin = series.getPrivate("minY");
                    seriesMax = series.getPrivate("maxY");
                }
                if ($type.isNumber(seriesMin) && $type.isNumber(seriesMax)) {
                    min = Math.min(min, seriesMin);
                    max = Math.max(max, seriesMax);
                    let diff = seriesMax - seriesMin;
                    if (diff <= 0) {
                        diff = Math.abs(seriesMax / 100);
                    }
                    if (diff < minDiff) {
                        minDiff = diff;
                    }
                }
            }
        });
        this.axisRanges.each((range) => {
            if (range.get("affectsMinMax")) {
                let value = range.get("value");
                if (value != null) {
                    min = Math.min(min, value);
                    max = Math.max(max, value);
                }
                value = range.get("endValue");
                if (value != null) {
                    min = Math.min(min, value);
                    max = Math.max(max, value);
                }
            }
        });
        if (this.get("logarithmic")) {
            let treatZeroAs = this.get("treatZeroAs");
            if ($type.isNumber(treatZeroAs)) {
                if (min <= 0) {
                    min = treatZeroAs;
                }
            }
            if (min <= 0) {
                new Error("Logarithmic value axis can not have values <= 0.");
            }
        }
        if (min === 0 && max === 0) {
            max = 0.9;
            min = -0.9;
        }
        if ($type.isNumber(minDefined)) {
            min = minDefined;
        }
        if ($type.isNumber(maxDefined)) {
            max = maxDefined;
        }
        // meaning no min/max found on series/ranges and no min/max was defined
        if (min === Infinity || max === -Infinity) {
            this.setPrivate("minFinal", undefined);
            this.setPrivate("maxFinal", undefined);
            return;
        }
        const initialMin = min;
        const initialMax = max;
        // adapter
        let minAdapted = this.adapters.fold("min", min);
        let maxAdapted = this.adapters.fold("max", max);
        if ($type.isNumber(minAdapted)) {
            min = minAdapted;
        }
        if ($type.isNumber(maxAdapted)) {
            max = maxAdapted;
        }
        // DateAxis does some magic here
        min = this._fixMin(min);
        max = this._fixMax(max);
        // this happens if starLocation and endLocation are 0.5 and DateAxis has only one date		
        if (max - min <= 1 / Math.pow(10, 15)) {
            if (max - min !== 0) {
                this._deltaMinMax = (max - min) / 2;
            }
            else {
                this._getDelta(max);
            }
            min -= this._deltaMinMax;
            max += this._deltaMinMax;
        }
        // add extras
        min -= (max - min) * extraMin;
        max += (max - min) * extraMax;
        if (this.get("logarithmic")) {
            // don't let min go below 0 if real min is >= 0
            if (min < 0 && initialMin >= 0) {
                min = 0;
            }
            // don't let max go above 0 if real max is <= 0
            if (max > 0 && initialMax <= 0) {
                max = 0;
            }
        }
        this._minReal = min;
        this._maxReal = max;
        let strictMinMax = this.get("strictMinMax");
        let strictMinMaxSelection = this.get("strictMinMaxSelection", false);
        if (strictMinMaxSelection) {
            strictMinMax = strictMinMaxSelection;
        }
        let strict = strictMinMax;
        if ($type.isNumber(maxDefined)) {
            strict = true;
        }
        let gridCount = this.get("renderer").gridCount();
        let minMaxStep = this._adjustMinMax(min, max, gridCount, strict);
        min = minMaxStep.min;
        max = minMaxStep.max;
        // do it for the second time with strict true (importat!)
        minMaxStep = this._adjustMinMax(min, max, gridCount, true);
        min = minMaxStep.min;
        max = minMaxStep.max;
        // return min max if strict
        if (strictMinMax) {
            if ($type.isNumber(minDefined)) {
                min = minDefined;
            }
            else {
                min = this._minReal;
            }
            if ($type.isNumber(maxDefined)) {
                max = maxDefined;
            }
            else {
                max = this._maxReal;
            }
            if (max - min <= 0.00000001) {
                min -= this._deltaMinMax;
                max += this._deltaMinMax;
            }
            min -= (max - min) * extraMin;
            max += (max - min) * extraMax;
        }
        minAdapted = this.adapters.fold("min", min);
        maxAdapted = this.adapters.fold("max", max);
        if ($type.isNumber(minAdapted)) {
            min = minAdapted;
        }
        if ($type.isNumber(maxAdapted)) {
            max = maxAdapted;
        }
        if (minDiff == Infinity) {
            minDiff = (max - min);
        }
        // this is to avoid floating point number error
        let decCount = Math.round(Math.abs(Math.log(Math.abs(max - min)) * Math.LOG10E)) + 5;
        min = $math.round(min, decCount);
        max = $math.round(max, decCount);
        const syncWithAxis = this.get("syncWithAxis");
        if (syncWithAxis) {
            minMaxStep = this._syncAxes(min, max, minMaxStep.step, syncWithAxis.getPrivate("minFinal", syncWithAxis.getPrivate("min", 0)), syncWithAxis.getPrivate("maxFinal", syncWithAxis.getPrivate("max", 1)), syncWithAxis.getPrivate("step", 1));
            min = minMaxStep.min;
            max = minMaxStep.max;
        }
        this.setPrivateRaw("maxZoomFactor", Math.max(1, Math.ceil((max - min) / minDiff * this.get("maxZoomFactor", 100))));
        this._fixZoomFactor();
        if (this.get("logarithmic")) {
            this._minLogAdjusted = min;
            min = this._minReal;
            max = this._maxReal;
            if (min <= 0) {
                min = initialMin * (1 - Math.min(extraMin, 0.99));
            }
        }
        if ($type.isNumber(min) && $type.isNumber(max)) {
            if (this.getPrivate("minFinal") !== min || this.getPrivate("maxFinal") !== max) {
                this.setPrivate("minFinal", min);
                this.setPrivate("maxFinal", max);
                this._saveMinMax(min, max);
                const duration = this.get("interpolationDuration", 0);
                const easing = this.get("interpolationEasing");
                this.animatePrivate({ key: "min", to: min, duration, easing });
                this.animatePrivate({ key: "max", to: max, duration, easing });
            }
        }
    }
    _fixZoomFactor() {
    }
    _getDelta(max) {
        // the number by which we need to raise 10 to get difference
        let exponent = Math.log(Math.abs(max)) * Math.LOG10E;
        // here we find a number which is power of 10 and has the same count of numbers as difference has
        let power = Math.pow(10, Math.floor(exponent));
        // reduce this number by 10 times
        power = power / 10;
        this._deltaMinMax = power;
    }
    _saveMinMax(_min, _max) {
    }
    _adjustMinMax(min, max, gridCount, strictMode) {
        // will fail if 0
        if (gridCount <= 1) {
            gridCount = 1;
        }
        gridCount = Math.round(gridCount);
        let initialMin = min;
        let initialMax = max;
        let difference = max - min;
        // in case min and max is the same, use max
        if (difference === 0) {
            difference = Math.abs(max);
        }
        // the number by which we need to raise 10 to get difference
        let exponent = Math.log(Math.abs(difference)) * Math.LOG10E;
        // here we find a number which is power of 10 and has the same count of numbers as difference has
        let power = Math.pow(10, Math.floor(exponent));
        // reduce this number by 10 times
        power = power / 10;
        let extra = power;
        if (strictMode) {
            extra = 0;
        }
        // round down min
        if (strictMode) {
            min = Math.floor(min / power) * power;
            // round up max
            max = Math.ceil(max / power) * power;
        }
        else {
            min = Math.ceil(min / power) * power - extra;
            // round up max
            max = Math.floor(max / power) * power + extra;
        }
        // don't let min go below 0 if real min is >= 0
        if (min < 0 && initialMin >= 0) {
            min = 0;
        }
        // don't let max go above 0 if real max is <= 0
        if (max > 0 && initialMax <= 0) {
            max = 0;
        }
        exponent = Math.log(Math.abs(difference)) * Math.LOG10E;
        power = Math.pow(10, Math.floor(exponent));
        power = power / 100; // used to be 10 in v4, but this caused issue that there could be limited number of grids with even very small minGridDistance
        // approximate difference between two grid lines
        let step = Math.ceil((difference / gridCount) / power) * power;
        let stepPower = Math.pow(10, Math.floor(Math.log(Math.abs(step)) * Math.LOG10E));
        // the step should divide by  2, 5, and 10.
        let stepDivisor = Math.ceil(step / stepPower); // number 0 - 10
        if (stepDivisor > 5) {
            stepDivisor = 10;
        }
        else if (stepDivisor <= 5 && stepDivisor > 2) {
            stepDivisor = 5;
        }
        // now get real step
        step = Math.ceil(step / (stepPower * stepDivisor)) * stepPower * stepDivisor;
        let maxPrecision = this.get("maxPrecision");
        if ($type.isNumber(maxPrecision)) {
            let ceiledStep = $math.ceil(step, maxPrecision);
            if (maxPrecision < Number.MAX_VALUE && step !== ceiledStep) {
                step = ceiledStep;
            }
        }
        let decCount = 0;
        // in case numbers are smaller than 1
        if (stepPower < 1) {
            // exponent is less then 1 too. Count decimals of exponent
            decCount = Math.round(Math.abs(Math.log(Math.abs(stepPower)) * Math.LOG10E)) + 1;
            // round step
            step = $math.round(step, decCount);
        }
        // final min and max
        let minCount = Math.floor(min / step);
        min = $math.round(step * minCount, decCount);
        let maxCount;
        if (!strictMode) {
            maxCount = Math.ceil(max / step);
        }
        else {
            maxCount = Math.floor(max / step);
        }
        if (maxCount === minCount) {
            maxCount++;
        }
        max = $math.round(step * maxCount, decCount);
        if (max < initialMax) {
            max = max + step;
        }
        if (min > initialMin) {
            min = min - step;
        }
        step = this.fixSmallStep(step);
        return { min: min, max: max, step: step };
    }
    /**
     * Returns text to be used in an axis tooltip for specific relative position.
     *
     * @param   position  Position
     * @return            Tooltip text
     */
    getTooltipText(position, _adjustPosition) {
        const numberFormat = this.get("tooltipNumberFormat", this.get("numberFormat"));
        const formatter = this.getNumberFormatter();
        const extraDecimals = this.get("extraTooltipPrecision", 0);
        const decimals = this.getPrivate("stepDecimalPlaces", 0) + extraDecimals;
        const value = $math.round(this.positionToValue(position), decimals);
        if (numberFormat) {
            return formatter.format(value, numberFormat);
        }
        else {
            return formatter.format(value, undefined, decimals);
        }
    }
    /**
     * Returns a data item from series that is closest to the `position`.
     *
     * @param   series    Series
     * @param   position  Relative position
     * @return            Data item
     */
    getSeriesItem(series, position) {
        let fieldName = (this.getPrivate("name") + this.get("renderer").getPrivate("letter"));
        let value = this.positionToValue(position);
        let index = undefined;
        let oldDiff;
        $array.each(series.dataItems, (dataItem, i) => {
            const diff = Math.abs(dataItem.get(fieldName) - value);
            if (index === undefined || diff < oldDiff) {
                index = i;
                oldDiff = diff;
            }
        });
        if (index != null) {
            return series.dataItems[index];
        }
    }
    /**
     * Zooms the axis to specific `start` and `end` values.
     *
     * Optional `duration` specifies duration of zoom animation in milliseconds.
     *
     * @param  start     Start value
     * @param  end       End value
     * @param  duration  Duration in milliseconds
     */
    zoomToValues(start, end, duration) {
        const min = this.getPrivate("minFinal", 0);
        const max = this.getPrivate("maxFinal", 0);
        if (this.getPrivate("min") != null && this.getPrivate("max") != null) {
            this.zoom((start - min) / (max - min), (end - min) / (max - min), duration);
        }
    }
    /**
     * Syncs with a target axis.
     *
     * @param  min  Min
     * @param  max  Max
     * @param  step Step
     */
    _syncAxes(min, max, step, syncMin, syncMax, syncStep) {
        let axis = this.get("syncWithAxis");
        if (axis) {
            let count = Math.round(syncMax - syncMin) / syncStep;
            let currentCount = Math.round((max - min) / step);
            let gridCount = this.get("renderer").gridCount();
            if ($type.isNumber(count) && $type.isNumber(currentCount)) {
                let synced = false;
                let c = 0;
                let diff = (max - min) * 0.01;
                let omin = min;
                let omax = max;
                let ostep = step;
                while (synced != true) {
                    synced = this._checkSync(omin, omax, ostep, count);
                    c++;
                    if (c > 500) {
                        synced = true;
                    }
                    if (!synced) {
                        if (c / 3 == Math.round(c / 3)) {
                            omin = min - diff * c;
                            if (min >= 0 && omin < 0) {
                                omin = 0;
                            }
                        }
                        else {
                            omax = max + diff * c;
                            if (omax <= 0 && omax > 0) {
                                omax = 0;
                            }
                        }
                        let minMaxStep = this._adjustMinMax(omin, omax, gridCount, true);
                        omin = minMaxStep.min;
                        omax = minMaxStep.max;
                        ostep = minMaxStep.step;
                    }
                    else {
                        min = omin;
                        max = omax;
                        step = ostep;
                    }
                }
            }
        }
        return { min: min, max: max, step: step };
    }
    /**
     * Returns `true` if axis needs to be resunced with some other axis.
     */
    _checkSync(min, max, step, count) {
        let currentCount = (max - min) / step;
        for (let i = 1; i < count; i++) {
            if ($math.round(currentCount / i, 1) == count || currentCount * i == count) {
                return true;
            }
        }
        return false;
    }
    /**
     * Returns relative position between two grid lines of the axis.
     *
     * @return Position
     */
    getCellWidthPosition() {
        let max = this.getPrivate("selectionMax", this.getPrivate("max"));
        let min = this.getPrivate("selectionMin", this.getPrivate("min"));
        if ($type.isNumber(max) && $type.isNumber(min)) {
            return this.getPrivate("step", 1) / (max - min);
        }
        return 0.05;
    }
}
Object.defineProperty(ValueAxis, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ValueAxis"
});
Object.defineProperty(ValueAxis, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Axis.classNames.concat([ValueAxis.className])
});
//# sourceMappingURL=ValueAxis.js.map