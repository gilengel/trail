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
import {
  ImagesService,
} from './images.service';
import { dbimages2dto } from '../conversion';
import ImagesUploadInterceptor from './helper/images.upload.intercepter';
import { ImageDto } from './dto/image.dto';

@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(ImagesUploadInterceptor)
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    try {
      const images = await this.imagesService.saveImages(files);
      return Promise.resolve(dbimages2dto(images));
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getImages(
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
}
