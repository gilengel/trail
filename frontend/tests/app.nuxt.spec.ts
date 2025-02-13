import {describe, it} from "vitest";
import {renderSuspended} from "@nuxt/test-utils/runtime";
import App from "~/app.vue";

describe("app", () => {
    it("can also render an app", async () => {
        await renderSuspended(App, {route: "/"});
    });
});
