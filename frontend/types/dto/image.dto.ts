/**
 * @file Dto definitions for images, both api and database (internal).
 */
export interface DbImageDto {
    id: string;

    timestamp: Date;

    coordinates: string;

    mime_type: string;
}

export interface ImageDto {
    id: string;

    timestamp: Date;

    name: string;

    coordinates: Array<number>;

    url: string;
}

export interface CountDto {
    count: string;
}
