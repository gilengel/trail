/**
 * @file Public API for images.
 */
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { dbimages2dto } from '../conversion';
import ImagesUploadInterceptor from './helper/images.upload.interceptor';
import { ImageDto, CountDto } from './dto/image.dto';
import { RoutesSegmentsService } from '../routes.segments/routes.segments.service';

@Controller('images')
export class ImagesController {
  private readonly logger = new Logger(ImagesService.name);

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
        0,
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

  private validateImageParameters(offset: number, routeSegmentId: number) {
    if (offset < 0) {
      throw new HttpException('Invalid Index', HttpStatus.BAD_REQUEST);
    }

    // integer limit of postgis
    if (routeSegmentId > 2147483647) {
      throw new HttpException(
        'Invalid route segment id',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('route_segment')
  async getImagesNearRouteSegment(
    @Query('routeSegmentId') routeSegmentId: number,
    @Query('maxOffset') offset: number,
    @Query('maxNumberOfImages') maxNumberOfImages?: number,
  ): Promise<ImageDto[]> {
    this.validateImageParameters(offset, routeSegmentId);

    let images: Array<ImageDto> = [];
    try {
      const routeSegment =
        await this.routeSegmentService.findOne(routeSegmentId);
      images = await this.imagesService.getImagesNearRouteSegment(
        routeSegment,
        offset,
        maxNumberOfImages,
      );
    } catch (e) {
      return Promise.reject(e);
    }

    if (images.length == 0) {
      return Promise.reject(new HttpException('', HttpStatus.NOT_FOUND));
    }

    return Promise.resolve(images);
  }

  @Get('route_segment/number')
  async getNumberOfImagesNearRouteSegment(
    @Query('routeSegmentId') routeSegmentId: number,
    @Query('maxOffset') offset: number,
  ): Promise<CountDto> {
    this.validateImageParameters(offset, routeSegmentId);

    let images: CountDto | undefined = undefined;
    try {
      const routeSegment =
        await this.routeSegmentService.findOne(routeSegmentId);
      images = await this.imagesService.getNumberOfImagesNearRouteSegment(
        routeSegment,
        offset,
      );
    } catch (e) {
      this.logger.error(e);

      return Promise.reject(new HttpException(e, HttpStatus.NOT_FOUND));
    }

    if (parseInt(images.count) == 0) {
      return Promise.reject(new HttpException('', HttpStatus.NOT_FOUND));
    }

    return Promise.resolve({ count: Number(images.count).toString() });
  }
}
