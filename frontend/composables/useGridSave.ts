import type {Grid} from "~/types/grid";
import type {TripDto} from "~/types/route";

/**
 * Persists the grid to the backend.
 * @param grid - The grid you want to persist.
 */
export async function useGridSave(grid: Grid) {
    await $fetch<TripDto>(
        `/api/trips/119`,
        {
            method: "PATCH",
            body: {
                layout: grid
            }
        }
    )
}



