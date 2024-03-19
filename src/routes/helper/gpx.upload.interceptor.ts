import { FileInterceptor } from '@nestjs/platform-express';

/**
 * Restricts uploading of route files to gpx
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
