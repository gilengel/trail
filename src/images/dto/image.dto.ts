export interface DbImageDto {
  uuid: string;
  timestamp: Date;
  coordinates: string;
}

export interface ImageDto {
  uuid: string;
  name: string;
  coordinates: Array<number>;
}
