import {describe, it, expect} from "vitest";
import {addAlphaToColor} from "~/types/color";

describe("addAlphaToColor", () => {

    // RGB input
    it("should convert RGB to RGBA with the correct alpha value", () => {
        const color = "rgb(255, 0, 0)";
        const alpha = 0.5;
        const result = addAlphaToColor(color, alpha);
        expect(result).toBe("rgba(255, 0, 0, 0.5)");
    });

    it("should handle RGB with a full alpha value (1)", () => {
        const color = "rgb(0, 255, 0)";
        const alpha = 1;
        const result = addAlphaToColor(color, alpha);
        expect(result).toBe("rgba(0, 255, 0, 1)");
    });

    // RGBA input
    it("should update the alpha value for RGBA colors", () => {
        const color = "rgba(255, 0, 0, 0.2)";
        const alpha = 0.8;
        const result = addAlphaToColor(color, alpha);
        expect(result).toBe("rgba(255, 0, 0, 0.8)");
    });

    it("should retain RGB values and change only the alpha in RGBA", () => {
        const color = "rgba(0, 255, 0, 0.3)";
        const alpha = 0.6;
        const result = addAlphaToColor(color, alpha);
        expect(result).toBe("rgba(0, 255, 0, 0.6)");
    });

    // Invalid color format (HEX, etc.)
    it("should throw an error for invalid color formats (HEX)", () => {
        const color = "#ff0000";
        const alpha = 0.5;
        expect(() => addAlphaToColor(color, alpha)).toThrowError(
            "Invalid color format. Expected rgb() or rgba()."
        );
    });
});
