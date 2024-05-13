import { defineStore } from 'pinia'
import http from '../api'
import L from 'leaflet'
import { LeafletRoute, type RouteDto, LeafletSegment, type RouteWithoutSegments } from './types'
import { ref, type Ref } from 'vue'
import type { AxiosError } from 'axios'
import axios from 'axios'

function randomColor() {
  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 255)
  const b = Math.floor(Math.random() * 255)

  return `rgb(${r}, ${g}, ${b})`
}

export const useRouteStore = defineStore('route', () => {
  const networkError: Ref<Boolean> = ref(false)

  const routesWithoutSegments: Ref<RouteWithoutSegments[]> = ref([])

  const routes: Ref<Map<number, LeafletRoute>> = ref(new Map())

  async function getRoutes(): Promise<RouteWithoutSegments[]> {
    try {
      const result = await http.get<RouteWithoutSegments[]>('/api/routes')

      routesWithoutSegments.value = result.data
      return Promise.resolve(result.data)
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        console.error(':(')
      }
      const error = e as AxiosError

      if (error.response) {
        console.error(error.response)
      } else if (error.request) {
        console.error(error.request)
      } else if (error.message) {
        console.error(error.message)
      }

      networkError.value = true

      return Promise.reject(error)
    }
  }

  async function getRoute(id: number): Promise<LeafletRoute> {
    const route = routes.value.get(id)

    // Route was previously requested and is cached so no need to call the backend
    if (route) {
      return Promise.resolve(route)
    }

    try {
      const result = await http.get<RouteDto>(`/api/routes/${id}`)

      const segments: LeafletSegment[] = result.data.segments.map((segment) => {
        return new LeafletSegment(
          segment.id,
          segment.name,
          segment.coordinates.map(
            (coordinate) => new L.LatLng(coordinate[0], coordinate[1], coordinate[2])
          ),
          randomColor(),
          segment.description
        )
      })

      const fetchedRoute = new LeafletRoute(
        result.data.id,
        result.data.name,
        segments,
        result.data.description
      )
      routes.value.set(id, fetchedRoute)

      return Promise.resolve(fetchedRoute)
    } catch (error) {
      networkError.value = true

      return Promise.reject(error)
    }
  }

  async function updateRoute(route: LeafletRoute) {
    await http.patch(`/api/routes/${route.id}`, {
      name: route.name,
      description: route.description
    })
  }

  async function addRoute(name: string, trips: File[]) {
    const formData = new FormData()

    formData.append('name', name)
    for (let i = 0; i < trips.length; ++i) {
      formData.append('files', trips[i])
    }

    await http.post('/api/routes/gpx', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  return { getRoutes, networkError, routesWithoutSegments, addRoute, getRoute, updateRoute }
})

export type RouteStore = ReturnType<typeof useRouteStore>
