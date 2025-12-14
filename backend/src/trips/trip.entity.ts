/**
 * @file Entity definition for a trip. Only to be used in domain logic.
 */
import { Route } from "../routes/routes/route.entity"

export type Trip = {
 id: number,
 
 name: string,

 layout: string,

 routes: Route[]
}