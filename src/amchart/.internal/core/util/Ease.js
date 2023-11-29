/**
 * A collection of easing functions
 *
 * Parts of this collection are taken from D3.js library (https://d3js.org/)
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import * as $math from "./Math";
/**
 * The functions below are from D3.js library (https://d3js.org/)
 *
 * ----------------------------------------------------------------------------
 * Copyright 2017 Mike Bostock
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *	this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *	this list of conditions and the following disclaimer in the documentation
 *	and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *	contributors may be used to endorse or promote products derived from this
 *	software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * ----------------------------------------------------------------------------
 * @hidden
 */
/**
 */
export function linear(t) {
    return t;
}
export function quad(t) {
    return t * t;
}
export function cubic(t) {
    return t * t * t;
}
export function pow(t, e) {
    return Math.pow(t, e);
}
export function exp(t) {
    return Math.pow(2, 10 * t - 10);
}
export function sine(t) {
    return 1 - Math.cos(t * $math.HALFPI);
}
export function circle(t) {
    return 1 - Math.sqrt(1 - t * t);
}
/**
 * ============================================================================
 * TRANSFORMERS
 * ============================================================================
 * @hidden
 */
/**
 */
export function yoyo(ease) {
    return function (t) {
        if (t < 0.5) {
            return ease(t * 2.0);
        }
        else {
            return ease((1.0 - t) * 2.0);
        }
    };
}
export function out(ease) {
    return function (t) {
        return 1.0 - ease(1.0 - t);
    };
}
export function inOut(ease) {
    return function (t) {
        if (t <= 0.5) {
            return ease(t * 2.0) / 2.0;
        }
        else {
            return 1.0 - (ease((1.0 - t) * 2.0) / 2.0);
        }
    };
}
/**
 * ============================================================================
 * BOUNCE
 * ============================================================================
 * @hidden
 */
let b1 = 4 / 11, b2 = 6 / 11, b3 = 8 / 11, b4 = 3 / 4, b5 = 9 / 11, b6 = 10 / 11, b7 = 15 / 16, b8 = 21 / 22, b9 = 63 / 64, b0 = 1 / b1 / b1;
export function bounce(t) {
    return 1 - bounceOut(1 - t);
}
/**
 * @ignore
 */
function bounceOut(t) {
    t = t;
    if (t < b1) {
        return b0 * t * t;
    }
    else if (t < b3) {
        return b0 * (t -= b2) * t + b4;
    }
    else if (t < b6) {
        return b0 * (t -= b5) * t + b7;
    }
    else {
        return b0 * (t -= b8) * t + b9;
    }
}
/**
 * ============================================================================
 * ELASTIC
 * ============================================================================
 * @hidden
 */
/**
 * @ignore
 */
let tau = 2 * Math.PI;
/**
 * @ignore
 */
let amplitude = 1;
/**
 * @ignore
 */
let period = 0.3 / tau;
/**
 * @ignore
 */
let s = Math.asin(1 / amplitude) * period;
export function elastic(t) {
    let v = t;
    return amplitude * Math.pow(2, 10 * --v) * Math.sin((s - v) / period);
}
//# sourceMappingURL=Ease.js.map