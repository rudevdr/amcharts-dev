/**
 * Modified from Pixi:
 *
 * The MIT License
 *
 * Copyright (c) 2013-2017 Mathew Groves, Chad Engler
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
import type { IPoint } from "./IPoint";
/**
 * @ignore
 */
export declare class Matrix {
    a: number;
    b: number;
    c: number;
    d: number;
    tx: number;
    ty: number;
    constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
    /**
     * Sets the matrix based on all the available properties
     */
    setTransform(x: number, y: number, pivotX: number, pivotY: number, rotation: number, scale?: number): void;
    /**
     * Get a new position with the current transformation applied.
     * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
     */
    apply(origin: IPoint): IPoint;
    /**
     * Get a new position with the inverse of the current transformation applied.
     * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
     */
    applyInverse(origin: IPoint): IPoint;
    /**
     * Appends the given Matrix to this Matrix.
     */
    append(matrix: Matrix): void;
    /**
     * Prepends the given Matrix to this Matrix.
     */
    prepend(matrix: Matrix): void;
    /**
     * Copies the other matrix's properties into this matrix
     */
    copyFrom(matrix: Matrix): void;
}
//# sourceMappingURL=Matrix.d.ts.map