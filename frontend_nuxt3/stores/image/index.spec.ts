import { setActivePinia, createPinia } from "pinia";
import { beforeEach, describe, expect, vi, type MockedFunction } from "vitest";
import { useImageStore } from "./index";
import * as L from "leaflet";

import axios from "axios";
import { mockFile } from "@/components/__tests__/util";
import { MapLibreSegment } from "../route/types";

vi.mock("axios", () => {
  return {
    default: {
      post: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      create: vi.fn().mockReturnThis(),
      interceptors: {
        request: {
          use: vi.fn(),
          eject: vi.fn(),
        },
        response: {
          use: vi.fn(),
          eject: vi.fn(),
        },
      },
    },
  };
});

const coordinate = L.latLng(47.387563828378916, 10.939971758052707);
const segment = new MapLibreSegment(
  0,
  "single segment",
  [
    [47.387563828378916, 10.939971758052707],
    [47.38756508566439, 10.939996987581253],
    [47.38756240345538, 10.940024564042687],
    [27.387563828378916, 10.9399717580527],
  ],
  "rgb(255, 255, 255)",
  "some segment description"
);

describe("Image Store", () => {
  beforeEach(() => {
    const get = axios.get as MockedFunction<typeof axios.get>;
    get.mockReset();

    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it("should get images near location", async () => {
    const imageStore = useImageStore();

    const get = axios.get as MockedFunction<typeof axios.get>;
    get.mockResolvedValue({
      data: [],
    });

    const images = await imageStore.getImagesNearLocation(coordinate, 500);
    expect(images).to.be.toStrictEqual([]);
  });

  it("should store that there was a network error if the backend call to receive images near a location was unsuccessful", async () => {
    const routeStore = useImageStore();

    const get = axios.get as MockedFunction<typeof axios.get>;
    get.mockRejectedValue({});

    await expect(() =>
      routeStore.getImagesNearLocation(coordinate, 500)
    ).rejects.toThrow();
  });

  it("should get images near segment", async () => {
    const imageStore = useImageStore();

    const get = axios.get as MockedFunction<typeof axios.get>;
    get.mockResolvedValue({
      data: [],
    });

    const images = await imageStore.getImagesNearRouteSegment(segment, 500);
    expect(images).to.be.toStrictEqual([]);
  });

  it("should store that there was a network error if the backend call to receive images near a segment was unsuccessful", async () => {
    const routeStore = useImageStore();

    const get = axios.get as MockedFunction<typeof axios.get>;
    get.mockRejectedValue({});

    await expect(() =>
      routeStore.getImagesNearRouteSegment(segment, 500)
    ).rejects.toThrow();
  });

  it("should contact the backend to store new images", async () => {
    const routeStore = useImageStore();

    const post = axios.post as MockedFunction<typeof axios.post>;
    post.mockResolvedValue({});

    const spy = vi.spyOn(axios, "post");

    await routeStore.addImages([mockFile("gpx", 1000)]);
    expect(spy).toBeCalledTimes(1);
  });
});
