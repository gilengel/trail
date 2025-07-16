/**
 * @file DTO specification for updating a route segment.
 */
import { PartialType } from './partial';
import { ValidateIf } from 'class-validator';
import { CreateRouteSegment } from './create.route.segment.dto';

export class UpdateRouteSegmentDto extends PartialType(CreateRouteSegment) {
    /*
    @ValidateIf((dto: UpdateRouteSegmentDto) => !dto.name && !dto.description && !dto.coordinates)
    validateAtLeastOneField() {
        throw new Error('At least one field (name, description, or coordinates) must be set.');
    }
    */
}
