import type {Grid} from "~/types/grid";
import type {RouteDto} from "~/types/route";

/**
 * Persists the grid to the backend.
 * @param grid - The grid you want to persist.
 * @param tripId - The id of the trip the grid is related to.
 */
export async function useGridSave(grid: Grid, tripId: number) {
    await $fetch<RouteDto>(
        `/api/trips/${tripId}`,
        {
            method: "PATCH",
            body: {
                layout: grid
            }
        }
    )
}



