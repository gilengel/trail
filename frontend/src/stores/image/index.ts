import { defineStore } from 'pinia'
import http from '../api'
import { ref, type Ref } from 'vue'
import type { ImageDto } from './types'
import type { LeafletSegment } from '../route/types'
import type { AxiosError } from 'axios'

export const useImageStore = defineStore('image', () => {
  const networkError: Ref<Boolean> = ref(false)

  async function getImagesNearLocation(coordinate: L.LatLng, offset: number): Promise<ImageDto[]> {
    try {
      const result = await http.get<ImageDto[]>('/api/images/point', {
        params: {
          lon: coordinate.lng,
          lat: coordinate.lat,
          maxOffset: offset
        }
      })

      return Promise.resolve(result.data)
    } catch (error) {
      networkError.value = true

      return Promise.reject(error)
    }
  }

  async function getImagesNearRouteSegment(
    segment: LeafletSegment,
    offset: number
  ): Promise<ImageDto[]> {
    try {
      const result = await http.get<ImageDto[]>('/api/images/route_segment', {
        params: {
          routeSegmentId: segment.id,
          maxOffset: offset
        }
      })

      result.data.forEach((image) => (image.url = `http://localhost:3000/${image.url}`))

      return Promise.resolve(result.data)
    } catch (error) {
      const e = error as AxiosError

      // The backend is build to return a 404 if no images exist so we need to return an empty array
      // to not arise an error on browser side
      if (e.response?.status == 404) {
        return Promise.resolve([])
      }

      networkError.value = true

      return Promise.reject(error)
    }
  }

  async function addImages(images: File[]) {
    const formData = new FormData()

    for (let i = 0; i < images.length; ++i) {
      formData.append(`files`, images[i])
    }

    await http.post('/api/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  return { getImagesNearLocation, getImagesNearRouteSegment, addImages }
})

export type ImageStore = ReturnType<typeof useImageStore>
