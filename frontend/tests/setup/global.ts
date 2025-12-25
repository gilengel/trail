import { beforeEach, vi } from "vitest";
import { mockFetch } from "./fetchMock";
import "vuetify/styles";

// Mock maplibre-gl components and methods
vi.mock("maplibre-gl", () => {
  const Map = vi.fn().mockImplementation(function () {
    return {
      setCenter: vi.fn(),
      setZoom: vi.fn(),
      on: vi.fn((event, cb) => {
        if (event === "load") cb();
      }),
      once: vi.fn((event, cb) => {
        if (event === "load") cb();
      }),
      isStyleLoaded: vi.fn(() => true),
      addSource: vi.fn(),
      removeSource: vi.fn(),
      addLayer: vi.fn(),
      removeLayer: vi.fn(),
      fitBounds: vi.fn(),
      panTo: vi.fn(),
    };
  });

  class LngLat {
    constructor(
      public lng: number,
      public lat: number,
    ) {}

    toArray() {
      return [this.lng, this.lat];
    }
  }

  class LngLatBounds {
    extend() {}

    getCenter() {
      return { lat: 0, lng: 0 };
    }

    isEmpty() {
      return false;
    }
  }

  return { Map, LngLat, LngLatBounds };
});

beforeEach(() => {
  vi.restoreAllMocks();
  mockFetch();
});
