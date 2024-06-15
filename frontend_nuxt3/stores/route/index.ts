import { defineStore } from "pinia";
import {
  MapLibreTrip,
  type TripDto,
  MapLibreSegment,
  type RouteWithoutSegments,
  type TripSegmentDto,
} from "./types";
import { ref, type Ref } from "vue";
import type { AxiosError } from "axios";
import axios from "axios";

function randomColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);

  return `rgb(${r}, ${g}, ${b})`;
}

export const useRouteStore = defineStore("route", () => {
  const networkError: Ref<boolean> = ref(false);

  const routesWithoutSegments: Ref<RouteWithoutSegments[]> = ref([]);

  const routes: Ref<Map<number, MapLibreTrip>> = ref(new Map());

  async function getRoutes(): Promise<Ref<RouteWithoutSegments[]>> {
    const { data } = await useFetch<RouteWithoutSegments[]>(
      `${process.env.BASE_URL}/api/routes`,
      {
        onResponse({ request, response, options }) {
          routesWithoutSegments.value = response._data;
        },
        onResponseError({ request, response, options }) {
          networkError.value = true;
        },
      }
    );

    if (!data) {
      Promise.reject(new Error());
    }

    return Promise.resolve(data as Ref<RouteWithoutSegments[]>);
  }

  async function getRoute(id: number): Promise<MapLibreTrip> {
    const route = routes.value.get(id);

    // Route was previously requested and is cached so no need to call the backend
    if (route) {
      return Promise.resolve(route);
    }

    const { data } = await useFetch<TripDto>(
      `${process.env.BASE_URL}/api/routes/${id}`,
      {
        onResponse({ request, response, options }) {
          const segments: MapLibreSegment[] = response._data.segments.map(
            (segment: TripSegmentDto) => {
              return new MapLibreSegment(
                segment.id,
                segment.name,
                segment.coordinates,
                randomColor(),
                segment.description
              );
            }
          );

          const fetchedRoute = new MapLibreTrip(
            response._data.id,
            response._data.name,
            segments,
            response._data.description
          );
          routes.value.set(id, fetchedRoute);
        },
        onResponseError({ request, response, options }) {
          networkError.value = true;
        },
      }
    );

    if (!data) {
      Promise.reject(new Error());
    }

    return Promise.resolve(data.value as MapLibreTrip);
  }

  async function updateRoute(route: MapLibreTrip) {
    await $fetch(`${process.env.BASE_URL}/api/routes/${route.id}`, {
      method: "patch",
      body: {
        name: route.name,
        description: route.description,
      },
    });
  }

  async function addRoute(name: string, trips: File[]) {
    const formData = new FormData();

    formData.append("name", name);
    for (const tripFile of trips) {
      formData.append("files", tripFile);
    }

    await $fetch(`${process.env.BASE_URL}/api/routes/gpx`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });
  }

  return {
    getRoutes,
    networkError,
    routesWithoutSegments,
    addRoute,
    getRoute,
    updateRoute,
  };
});

export type RouteStore = ReturnType<typeof useRouteStore>;
