import { Injectable, NotFoundException } from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { StreamableFile } from '@nestjs/common';
import { _datei } from '@my-workspace/prisma_cruds';

@Injectable()
export class FileStreamService {
  async getFileStream(
    id: number
  ): Promise<{ stream: StreamableFile; contentType: string; fileName: string }> {
    if (!id) {
      throw new NotFoundException('ID parameter is required');
    }

    // Fetch the file record from the database asynchronously
    // const datei = await _datei.findOne({ where: { id } });
    //
    // if (!datei) {
    //   throw new NotFoundException(`No file record found for ID: ${id}`);
    // }

    // const filePath = datei.path;
    const filePath = join(process.cwd(), 'uploads/mitarbeiter/24/certificates/TV-2024-02-02.pdf');

    if (!existsSync(filePath)) {
      throw new NotFoundException(`File not found at path: ${filePath}`);
    }

    // Extract filename from the path (or use datei.name if available)
    const fileName = filePath.split('/').pop() || 'unknown'; // Gets 'TV-2024-02-02.pdf' from the path

    let contentType: string;
    if (fileName.endsWith('.pdf')) {
      contentType = 'application/pdf';
    } else if (fileName.endsWith('.png')) {
      contentType = 'image/png';
    } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
      contentType = 'image/jpeg';
    } else {
      contentType = 'application/octet-stream'; // Fallback
    }

    const fileStream = createReadStream(filePath);
    return {
      stream: new StreamableFile(fileStream),
      contentType,
      fileName
    };
  }
}
