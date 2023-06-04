import { Injectable } from '@nestjs/common';
import { join, dirname } from 'path';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';

@Injectable()
export class FileSystemService {
  convertBase64ToFile(base64: string, fileName: string): string {
    const buffer = Buffer.from(base64, 'base64');
    const toPath = join(__dirname, '../temp/') + fileName; // guardar archivo en disco
    this.ensureDirectoryExistence(toPath);
    writeFileSync(toPath, buffer);
    return toPath;
  }

  deleteFile(localFilePath: string) {
    unlinkSync(localFilePath);
  }

  ensureDirectoryExistence(filePath: string) {
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
}
