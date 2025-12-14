/**
 * @file Public API for images.
 */
import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Post,
  Query,
  UnprocessableEntityException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import ExifReader from 'exifreader';
import { ImagesService } from './images.service';
import ImagesUploadInterceptor from './helper/images.upload.interceptor';
import { RouteSegmentsService } from '../routes/segments/route.segments.service';
import * as DTO from '../dto';

export class NoOrWrongGeoInformationError extends Error {
  constructor() {
    super('The provided image has no or wrong geo information.');
  }
}


@Controller('images')
export class ImagesController {
  private readonly logger = new Logger(ImagesService.name);

  constructor(
    private imagesService: ImagesService,
    private routeSegmentService: RouteSegmentsService,
  ) { }

  @Post()
  @UseInterceptors(ImagesUploadInterceptor)
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<DTO.Image[]> {
    try {
      const createImageDtos = await this.file2CreateImageDto(files);
      const images = await this.imagesService.saveImages(createImageDtos);
      return Promise.resolve(images);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('point')
  async getImagesNearPoint(
    @Query('lon') longitude: number,
    @Query('lat') latitude: number,
    @Query('maxOffset') offset: number,
  ): Promise<DTO.Image[]> {
    if(longitude === undefined || latitude === undefined) {
      throw new BadRequestException();
    }

    let images: Array<DTO.Image> = [];
    try {
      images = await this.imagesService.getImagesNearCoordinate(
        [longitude, latitude, 0],
        offset,
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    if (images.length == 0) {
      throw new NotFoundException();
    }

    return Promise.resolve(images);
  }

  @Get('route_segment')
  async getImagesNearRouteSegment(
    @Query('routeSegmentId') routeSegmentId: number,
    @Query('maxOffset') offset: number,
    @Query('maxNumberOfImages') maxNumberOfImages?: number,
  ): Promise<DTO.Image[]> {
    this.validateImageParameters(offset, routeSegmentId);

    const routeSegment =
      await this.routeSegmentService.findOne(routeSegmentId);

    if (routeSegment === null) {
      throw new UnprocessableEntityException();
    }
    const images: Array<DTO.Image> = await this.imagesService.getImagesNearRouteSegment(
      routeSegment,
      offset,
      maxNumberOfImages,
    );


    if (images.length == 0) {
      return Promise.reject(new HttpException('', HttpStatus.NOT_FOUND));
    }

    return Promise.resolve(images);
  }

  @Get('route_segment/number')
  async getNumberOfImagesNearRouteSegment(
    @Query('routeSegmentId') routeSegmentId: number,
    @Query('maxOffset') offset: number,
  ): Promise<{ count: number}> {
    this.validateImageParameters(offset, routeSegmentId);

    let images: number | undefined = undefined;
    try {
      const routeSegment =
        await this.routeSegmentService.findOne(routeSegmentId);
      images = await this.imagesService.getNumberOfImagesNearRouteSegment(
        routeSegment,
        offset,
      );
    } catch (e) {
      throw new NotFoundException();
    }

    if (images == 0) {
      throw new NotFoundException();
    }

    return Promise.resolve({ count: images});
  }

  private extractCoordinates(image: Express.Multer.File): number[] {
    const metaInfo = ExifReader.load(image.buffer, {
      async: false,
      expanded: true,
      includeUnknown: true,
    });

    if (!metaInfo.gps) {
      throw new NoOrWrongGeoInformationError();
    }

    const longitude = metaInfo.gps.Longitude;
    const latitude = metaInfo.gps.Latitude;

    return [
      longitude,
      latitude,
    ];
  }

  private validateImageParameters(offset: number, routeSegmentId: number) {
    if (offset < 0) {
      throw new BadRequestException('Invalid offset: Must be >= 0');
    }

    // integer limit of postgis
    if (routeSegmentId > 2147483647) {
      throw new BadRequestException('Invalid route segment id');
    }
  }

  private async file2CreateImageDto(images: Express.Multer.File[]): Promise<DTO.CreateImage[]> {
    let values: DTO.CreateImage[] = [];
    try {
      values = images.map((image) => {
        return {
          name: '',
          mimeType: image.mimetype,
          buffer: image.buffer,
          coordinates: this.extractCoordinates(image)
        }
      });

      return Promise.resolve(values);
    } catch {
      return Promise.reject(new NoOrWrongGeoInformationError());
    }
  }
}
