import { Request, Response } from 'express';
import { asyncHandler, ApiResponse, ApiError } from '../../utils';
import { uploadToCloudinary } from '../../utils/cloudinary';

export class UploadController {
  uploadImage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw ApiError.badRequest('No file uploaded');
    }

    const result = await uploadToCloudinary(req.file);
    
    ApiResponse.success(
      res, 
      { url: result.url, publicId: result.publicId }, 
      'Image uploaded successfully'
    );
  });
}

export default new UploadController();
