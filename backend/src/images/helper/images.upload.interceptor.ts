/**
 * @file Checks incoming files for their type. It is used to limit the allowed file types to images only
 * (see https://docs.nestjs.com/techniques/file-upload).
 */
import { FilesInterceptor } from '@nestjs/platform-express';

/**
 * Restricts uploading of images to:
 * max. 10 images
 * allowed types: png, jpg, jpeg and tif.
 */

const ImagesUploadInterceptor = FilesInterceptor('files', 10, {
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/tiff') {
      cb(null, true);
    } else {
      return cb(new Error('Invalid mime type'), false);
    }
  },
});

export default ImagesUploadInterceptor;
