import { ValueAxis } from "./ValueAxis";
import * as $utils from "../../../core/util/Utils";
import * as $math from "../../../core/util/Math";
/**
 * Creates a duration axis.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/duration-axis/} for more info
 * @important
 */
export class DurationAxis extends ValueAxis {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_dataGrouped", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_groupingCalculated", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_intervalDuration", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
    }
    _afterNew() {
        this._settings.themeTags = $utils.mergeTags(this._settings.themeTags, ["axis"]);
        super._afterNew();
    }
    _adjustMinMax(min, max, gridCount, strictMode) {
        let minMaxStep;
        const durationFormatter = this.getDurationFormatter();
        const baseUnit = this.get("baseUnit");
        // we don't allow to go to smaller units, setting so to avoid invalidation
        this.setRaw("maxPrecision", 0);
        if (baseUnit == "millisecond" || baseUnit == "second" || baseUnit == "minute" || baseUnit == "hour") {
            // will fail if 0
            if (gridCount <= 1) {
                gridCount = 1;
            }
            gridCount = Math.round(gridCount);
            //let initialMin: number = min;
            //let initialMax: number = max;
            let difference = max - min;
            // in case min and max is the same, use max
            if (difference === 0) {
                difference = Math.abs(max);
            }
            let step = difference / gridCount;
            let divisors = [60, 30, 20, 15, 10, 2, 1];
            let realDivisor = 1;
            if (baseUnit == "hour") {
                divisors = [24, 12, 6, 4, 2, 1];
            }
            for (let divisor of divisors) {
                if (difference / divisor > gridCount) {
                    realDivisor = divisor;
                    break;
                }
            }
            let count = Math.ceil(((max - min) / realDivisor) / gridCount);
            let exponent = Math.log(Math.abs(count)) * Math.LOG10E;
            let power = Math.pow(10, Math.floor(exponent)) / 10;
            let reducedCount = count / power;
            // find closest to divisor
            let closest = $math.closest(divisors, reducedCount);
            count = closest * power;
            step = realDivisor * count;
            min = Math.floor(min / step) * step;
            max = Math.ceil(max / step) * step;
            /*
            causese SO with seconds
            if (strictMode) {
                min -= step;
                if (min < 0 && initialMin >= 0) {
                    min = 0;
                }
                max += step;

                if (max > 0 && initialMax <= 0) {
                    max = 0;
                }
            }*/
            minMaxStep = { min: min, max: max, step: step };
        }
        else {
            minMaxStep = super._adjustMinMax(min, max, gridCount, strictMode);
        }
        // choose duration formatter based on step
        this.setPrivateRaw("durationFormat", durationFormatter.getFormat(minMaxStep.step, minMaxStep.max, baseUnit));
        return minMaxStep;
    }
    _formatText(value) {
        const formatter = this.getDurationFormatter();
        return formatter.format(value, this.getPrivate("durationFormat"), this.get("baseUnit"));
    }
    /**
     * Returns text to be used in an axis tooltip for specific relative position.
     *
     * @param   position  Position
     * @return            Tooltip text
     */
    getTooltipText(position, _adjustPosition) {
        const formatter = this.getDurationFormatter();
        const extraDecimals = this.get("extraTooltipPrecision", 0);
        const decimals = this.getPrivate("stepDecimalPlaces", 0) + extraDecimals;
        const value = $math.round(this.positionToValue(position), decimals);
        return formatter.format(value, this.getPrivate("durationFormat"), this.get("baseUnit"));
    }
}
Object.defineProperty(DurationAxis, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "DurationAxis"
});
Object.defineProperty(DurationAxis, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ValueAxis.classNames.concat([DurationAxis.className])
});
//# sourceMappingURL=DurationAxis.js.map