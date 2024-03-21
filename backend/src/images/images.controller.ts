/**
 * @file Public API for images.
 */
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { dbimages2dto } from '../conversion';
import ImagesUploadInterceptor from './helper/images.upload.interceptor';
import { ImageDto } from './dto/image.dto';
import { RoutesSegmentsService } from '../routes.segments/routes.segments.service';

@Controller('images')
export class ImagesController {
  constructor(
    private imagesService: ImagesService,
    private routeSegmentService: RoutesSegmentsService,
  ) {}

  @Post()
  @UseInterceptors(ImagesUploadInterceptor)
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Array<ImageDto>> {
    try {
      const images = await this.imagesService.saveImages(files);
      return Promise.resolve(dbimages2dto(images));
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('point')
  async getImagesNearPoint(
    @Query('lon') longitude: number,
    @Query('lat') latitude: number,
    @Query('maxOffset') offset: number,
  ): Promise<ImageDto[]> {
    let images: Array<ImageDto> = [];
    try {
      images = await this.imagesService.getImagesNearCoordinate(
        longitude,
        latitude,
        offset,
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }

    if (images.length == 0) {
      throw new HttpException('', HttpStatus.NOT_FOUND);
    }

    return Promise.resolve(images);
  }

  @Get('route_segment')
  async getImagesNearRouteSegment(
    @Query('routeSegmentId') routeSegmentId: number,
    @Query('maxOffset') offset: number,
  ): Promise<ImageDto[]> {
    if (offset < 0) {
      throw new HttpException('Invalid Index', HttpStatus.BAD_REQUEST);
    }

    let images: Array<ImageDto> = [];
    try {
      const routeSegment =
        await this.routeSegmentService.findOne(routeSegmentId);
      images = await this.imagesService.getImagesNearRouteSegment(
        routeSegment,
        offset,
      );
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }

    if (images.length == 0) {
      throw new HttpException('', HttpStatus.NOT_FOUND);
    }

    return Promise.resolve(images);
  }
}
