/* eslint-disable no-undef */
import { expect } from "chai";
import { describe } from "mocha";
import { cssRgbaToRgba, cssRgbToRgba, rgbaHexToRgba, parseColorToRgba, rgbaToHexRgba, rgbHexToRgba, rgbaToHsla, hslaToRgba, cssHslaToHsla, hslaToCssHsla } from "../src/support/colors.js";

describe("Color utilities", function () {
    describe("the hex to rgba conversion function", function () {
        it("returns 0, 0, 0 and 1 for r, g, b and a given \"#01\"", function () {
            const rgba = rgbaHexToRgba("#01");
            expect(rgba).to.have.ordered.members([0, 0, 0, 1]);
        });

        it("returns 0, 0, 1 and 1 for r, g, b, and a given \"#0101\"", function () {
            const rgba = rgbaHexToRgba("#0101");
            expect(rgba).to.have.ordered.members([0, 0, 1, 1]);
        });

        it("returns 0, 1, 1 and 0 for r, g, b and a given \"#10100\"", function () {
            const rgba = rgbaHexToRgba("#10100");
            expect(rgba).to.have.ordered.members([0, 1, 1, 0]);
        });

        it("returns 255, 0, 0 and 0 for r, g, b and a given \"#FF000000\"", function () {
            const rgba = rgbaHexToRgba("#FF000000");
            expect(rgba).to.have.ordered.members([255, 0, 0, 0]);
        });

        it("returns 255, 255, 0 and 0 for r, g, b and a given \"#FFFF0000\"", function () {
            const rgba = rgbaHexToRgba("#FFFF0000");
            expect(rgba).to.have.ordered.members([255, 255, 0, 0]);
        });
    });

    describe("the hex to rgba conversion function (alpha will always be 255)", function () {
        it("returns 0, 0 and 1 for r, g and b given \"#1\"", function () {
            const rgb = rgbHexToRgba("#1");
            expect(rgb).to.have.ordered.members([0, 0, 1, 255]);
        });
        it("returns 0, 1 and 0 for r, g and b given \"#100\"", function () {
            const rgb = rgbHexToRgba("#100");
            expect(rgb).to.have.ordered.members([0, 1, 0, 255]);
        });
        it("returns 1, 0 and 1 for r, g and b given \"#10001\"", function () {
            const rgb = rgbHexToRgba("#10001");
            expect(rgb).to.have.ordered.members([1, 0, 1, 255]);
        });
    });

    describe("the css rgba function to rgba function", function () {
        it("returns 0, 0, 0 and 1 for r, g, b and a given \"rgba(0,0,0,1)\"", function () {
            const rgba = cssRgbaToRgba("rgba(0,0,0,1)");
            expect(rgba).to.have.ordered.members([0, 0, 0, 1]);
        });

        it("returns 0, 0, 1 and 1 for r, g, b, and a given \"#rgba(0,0,1,1)\"", function () {
            const rgba = cssRgbaToRgba("#rgba(0,0,1,1)");
            expect(rgba).to.have.ordered.members([0, 0, 1, 1]);
        });

        it("returns 0, 1, 1 and 0 for r, g, b and a given \"rgba(0,1,1,0)\"", function () {
            const rgba = cssRgbaToRgba("rgba(0,1,1,0)");
            expect(rgba).to.have.ordered.members([0, 1, 1, 0]);
        });

        it("returns 255, 0, 0 and 0 for r, g, b and a given \"rgba(255,0,0,0)\"", function () {
            const rgba = cssRgbaToRgba("rgba(255,0,0,0)");
            expect(rgba).to.have.ordered.members([255, 0, 0, 0]);
        });
    });

    describe("the css rgb function to rgba function (alpha will always be 255)", function () {
        it("returns 0, 0 and 1 for r, g and b given \"rgb(0,0,1)\"", function () {
            const rgba = cssRgbToRgba("rgb(0,0,1)");
            expect(rgba).to.have.ordered.members([0, 0, 1, 255]);
        });

        it("returns 0, 1 and 1 for r, g and b given \"#rgb(0,1,0)\"", function () {
            const rgba = cssRgbToRgba("#rgb(0,1,0)");
            expect(rgba).to.have.ordered.members([0, 1, 0, 255]);
        });

        it("returns 1, 1 and 1 for r, g and b given \"rgb(1,1,1)\"", function () {
            const rgba = cssRgbToRgba("rgb(1,1,1)");
            expect(rgba).to.have.ordered.members([1, 1, 1, 255]);
        });

        it("returns 1, 1 and 1 for r, g and b given \"rgb(1, 1, 1)\" (contains spaces)", function () {
            const rgba = cssRgbToRgba("rgb(1, 1, 1)");
            expect(rgba).to.have.ordered.members([1, 1, 1, 255]);
        });
    });

    describe("The function to convert r, g, b, and a represented as an array to hexadecimals", function () {
        it("Returns #00000001 when given an array of [0, 0, 0, 1]", function () {
            const hex = rgbaToHexRgba([0, 0, 0, 1]);
            expect(hex).to.equal("#00000001");
        });
        it("Returns #00000100 when given an array of [0, 0, 1, 0]", function () {
            const hex = rgbaToHexRgba([0, 0, 1, 0]);
            expect(hex).to.equal("#00000100");
        });
        it("Returns #00010000 when given an array of [0, 1, 0, 0]", function () {
            const hex = rgbaToHexRgba([0, 1, 0, 0]);
            expect(hex).to.equal("#00010000");
        });
        it("Returns #01000000 when given an array of [1, 0, 0, 0]", function () {
            const hex = rgbaToHexRgba([1, 0, 0, 0]);
            expect(hex).to.equal("#01000000");
        });
    });

    describe("The function that automatically converts a string containing an rgb(a) value to an rgba array.", function () {
        it("returns 1, 1, 1 and 1 for r, g, b and a given \"rgba(1,1,1,1)\"", function () {
            const rgba = parseColorToRgba("rgba(1,1,1,1)");
            expect(rgba).to.have.ordered.members([1, 1, 1, 1]);
        });
        it("returns 0, 1, 0 and 1 for r, g, b and a given \"#00010001\"", function () {
            const rgb = parseColorToRgba("#00010001");
            expect(rgb).to.have.ordered.members([0, 1, 0, 1]);
        });
        it("returns 1, 0, 1 and 255 for r, g, b and a given \"#10001\"", function () {
            const rgb = parseColorToRgba("#10001");
            expect(rgb).to.have.ordered.members([1, 0, 1, 255]);
        });
        it("returns 1, 1, 1 and 255 for r, g, b and a given \"rgb(1,1,1)\"", function () {
            const rgba = parseColorToRgba("rgb(1,1,1)");
            expect(rgba).to.have.ordered.members([1, 1, 1, 255]);
        });
        it("returns 1, 1, 1 and 1 for r, g, b and a given \"rgba(1, 1, 1, 1)\" (contains spaces)", function () {
            const rgba = parseColorToRgba("rgba(1, 1, 1, 1)");
            expect(rgba).to.have.ordered.members([1, 1, 1, 1]);
        });
    });

    describe("The function that converts a rgba array to hsl and a values.", function () {
        it("returns (approx.) 193, 100% and 50% for H, S, and V components given [0, 200, 255, 255]", function () {
            const [h, s, v, a] = rgbaToHsla([0, 200, 255, 255]);
            expect(h).to.be.closeTo(193, 0.1);
            expect(s).to.equal(1);
            expect(v).to.equal(0.5);
            expect(a).to.equal(255);
        });
        it("returns (approx.) 120, 100% and 70% for H, S, and V components given [102, 255, 102, 255]", function () {
            const [h, s, v, a] = rgbaToHsla([102, 255, 102, 255]);
            expect(h).to.be.closeTo(120, 0.1);
            expect(s).to.be.closeTo(1, 0.0001);
            expect(v).to.equal(0.7);
            expect(a).to.equal(255);
        });
    });

    describe("The function that converts a hsva array to rgba values.", function () {
        it("Returns (approx.) 0, 200, 255 and 255 for r, g, b and a given 193, 100%, 50% and 255.", function () {
            const [r, g, b, a] = hslaToRgba([193, 1, 0.5, 255]);
            expect(r).to.be.closeTo(0, 1);
            expect(g).to.be.closeTo(200, 1);
            expect(b).to.be.closeTo(255, 1);
            expect(a).to.equal(255);
        });
        it("Returns 61, 71, 77 and 255 for r, g, b and a given 200, 20%, 30% and 255.", function () {
            const [r, g, b, a] = hslaToRgba([203, 0.116, 0.271, 255]);
            expect(r).to.be.closeTo(61, 0.2);
            expect(g).to.be.closeTo(71, 0.2);
            expect(b).to.be.closeTo(77, 0.2);
            expect(a).to.equal(255);
        });
    });

    describe("The function that converts an css hsl function call to an array containing the individual h, s, l and a components.", function () {
        it("Returns [1, 0.01, 0.01, 1] given \"hsl(1, 1%, 1%, 1)\"", function () {
            const hsla = cssHslaToHsla("hsl(1, 1%, 1%, 1)");
            expect(hsla).to.have.ordered.members([1, 0.01, 0.01, 1]);
        });
    });

    describe("The function that converts an array representing hsla values to a css hsl function call.", function () {
        it("Returns \"hsl(1, 1%, 1%, 1)\" given [1, 0.01, 0.01, 1].", function () {
            const cssHsla = hslaToCssHsla([1, 0.01, 0.01, 1]);
            expect(cssHsla).to.equal("hsl(1, 1%, 1%, 1");
        });
    });
});