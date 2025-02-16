/**
 * @file Checks incoming files for their type. It is used to limit the allowed file types to gpx only
 * (see https://docs.nestjs.com/techniques/file-upload).
 */
import { FileInterceptor } from '@nestjs/platform-express';

/**
 * Restricts uploading of route files to gpx.
 */
const GPXUploadInterceptor = FileInterceptor('file', {
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'application/gpx' ||
      file.mimetype == 'application/gpx+xml'
    ) {
      cb(null, true);
    } else {
      return cb(new Error('Invalid mime type'), false);
    }
  },
});

export default GPXUploadInterceptor;
