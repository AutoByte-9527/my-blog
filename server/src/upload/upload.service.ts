import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File): Promise<{ url: string }> {
    // File is already saved by multer diskStorage in controller
    // Just return the URL
    return { url: `/uploads/${file.filename}` };
  }
}
