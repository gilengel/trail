/**
 * @file DTO specification for updating a route.
 */
import {ValidateIf} from "class-validator";
import { PartialType } from '../partial';
import {CreateRouteDto} from "./create.route.dto";

export class UpdateRouteDto  extends PartialType(CreateRouteDto) {
    @ValidateIf((dto: CreateRouteDto) => !dto.name && !dto.description && !dto.segments)
    validateAtLeastOneField() {
        throw new Error('At least one field (name, description, or segments) must be set.');
    }
}
