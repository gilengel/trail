/**
 * @file DTO specification for updating a route.
 */
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTripDto {
    @ApiProperty({
        required: false,
        example: "My Awesome Trip",
        description: "The name of the trip",
        type: () => String
    })
    name: string;

    @ApiProperty({
        required: false,
        example: {key: "value"},
        description: "Trip layout as JSON",
        type: () => Object
    })
    layout: object;
}
