/** @ignore */ /** */
import * as $array from "./Array";
/**
 * @ignore
 */
class Result {
    constructor(duration, iterations) {
        Object.defineProperty(this, "duration", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: duration
        });
        Object.defineProperty(this, "iterations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: iterations
        });
    }
    ms() {
        return this.duration / this.iterations;
    }
}
/**
 * @ignore
 */
function runTest(fn) {
    let iterations = 0;
    const start = Date.now();
    const end = start + 10000;
    for (;;) {
        if (!fn()) {
            return;
        }
        ++iterations;
        const now = Date.now();
        if (now >= end) {
            return new Result(now - start, iterations);
        }
    }
}
/**
 * @ignore
 */
export class Benchmark {
    constructor() {
        Object.defineProperty(this, "tests", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    test(name, fn) {
        this.tests.push({ name, fn });
    }
    run() {
        console.log("Benchmark starting...");
        let maxLen = 0;
        $array.each(this.tests, (test) => {
            if (!test.fn()) {
                throw new Error(test.name + " failed");
            }
            maxLen = Math.max(maxLen, test.name.length);
        });
        const empty = runTest(() => true).ms();
        $array.each(this.tests, (test) => {
            const result = runTest(test.fn);
            if (result) {
                console.log(`${test.name.padStart(maxLen)}:  ${(result.ms() - empty).toFixed(10)} ms`);
            }
            else {
                throw new Error(test.name + " failed");
            }
        });
        console.log("Benchmark finished");
    }
}
//# sourceMappingURL=Benchmark.js.map