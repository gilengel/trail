import { describe, it, expect, vi } from "vitest";

vi.stubGlobal(
  "$fetch",
  vi.fn().mockResolvedValue({ message: "mocked response" }),
);

describe("Composables[Delete]", () => {
  it("calls $fetch when patching", async () => {
    await useDelete("test");

    expect($fetch).toHaveBeenCalledOnce();
    expect($fetch).toHaveBeenCalledWith("test", { method: "DELETE" });
  });
});
