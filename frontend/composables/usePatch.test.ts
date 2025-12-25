import { describe, it, expect, vi } from "vitest";

vi.stubGlobal(
  "$fetch",
  vi.fn().mockResolvedValue({ message: "mocked response" }),
);

describe("Composables[Patch]", () => {
  it("calls $fetch when patching", async () => {
    await usePatch("test", {});

    expect($fetch).toHaveBeenCalledOnce();
    expect($fetch).toHaveBeenCalledWith("test", { body: {}, method: "PATCH" });
  });
});
