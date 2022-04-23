/* eslint-disable no-undef */
import { expect } from "chai";
import { describe } from "mocha";
import { createUniAvgSel } from "../src/support/bins.js";

describe("Bin utilities", function () {
    describe("the function that generates a uniform average of the array values", function () {
        it("returns 2 given [1, 2, 3]", function () {
            const unifAvgFunc = createUniAvgSel();
            const avg = unifAvgFunc([1, 2, 3]);
            expect(avg).to.equal(2);
        });
    });
});