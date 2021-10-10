import { Injectable } from '@nestjs/common';
import { promises } from 'fs';
import { resolve } from 'path';

import uploadConfig from '../../config/upload';

@Injectable()
export class DiskStorageService {
  async saveFile(file: string) {
    await promises.rename(
      resolve(uploadConfig.tmpFolder, file),
      resolve(uploadConfig.uploadsFolder, file),
    );

    return file;
  }

  async deleteFile(file: string) {
    const filePath = resolve(uploadConfig.uploadsFolder, file);

    try {
      await promises.stat(filePath);
    } catch {
      return;
    }

    await promises.unlink(filePath);
  }
}
