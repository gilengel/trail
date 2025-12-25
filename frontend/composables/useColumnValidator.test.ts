import { describe, it, expect } from "vitest";
import { columnValueValidator } from "~/composables/useColumValidator";

describe("Composables[ColumnValidator]", () => {
  it("returns true for a column with width between 0 and 12", async () => {
    expect(columnValueValidator(6)).toBeTruthy();
  });

  it("returns true for a column with width 0", async () => {
    expect(columnValueValidator(0)).toBeTruthy();
  });

  it("returns true for a column with width 12", async () => {
    expect(columnValueValidator(12)).toBeTruthy();
  });

  it("returns false for a column > 12", async () => {
    expect(columnValueValidator(13)).toBeFalsy();
  });

  it("returns false for a column < 0>", async () => {
    expect(columnValueValidator(-1)).toBeFalsy();
  });
});
