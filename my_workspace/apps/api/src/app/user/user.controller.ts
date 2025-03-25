// user.controller.ts
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  BadRequestException
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { UpdateUserVerwaltungDto } from './dto/user-verwaltung.dto';
import { RawBodyInterceptor } from '../interceptor/raw-body.interceptor';

// 2025-03-24 12:02:34 Raw Files: [
// 2025-03-24 12:02:34   {
// 2025-03-24 12:02:34     fieldname: 'user[files[3]]',
// 2025-03-24 12:02:34     originalname: 'blank_profile.png',
// 2025-03-24 12:02:34     encoding: 'binary',
// 2025-03-24 12:02:34     mimetype: 'image/png',
// 2025-03-24 12:02:34     destination: '/app/uploads',
// 2025-03-24 12:02:34     filename: 'blank_profile.png',
// 2025-03-24 12:02:34     path: '/app/uploads/blank_profile.png',
// 2025-03-24 12:02:34     size: 1190
// 2025-03-24 12:02:34   },
// 2025-03-24 12:02:34   {
// 2025-03-24 12:02:34     fieldname: 'user[files[7]]',
// 2025-03-24 12:02:34     originalname: 'TV-2024-02-02.pdf',
// 2025-03-24 12:02:34     encoding: 'binary',
// 2025-03-24 12:02:34     mimetype: 'application/pdf',
// 2025-03-24 12:02:34     destination: '/app/uploads',
// 2025-03-24 12:02:34     filename: 'TV-2024-02-02.pdf',
// 2025-03-24 12:02:34     path: '/app/uploads/TV-2024-02-02.pdf',
// 2025-03-24 12:02:34     size: 51904
// 2025-03-24 12:02:34   }
// 2025-03-24 12:02:34 ]

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('update_certificate')
  @UseInterceptors(AnyFilesInterceptor())
  async updateUserCertificate(
    @Body() body: UpdateUserVerwaltungDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    console.log('Raw Files:', files);
    console.log('Transformed Body:', body);

    const mitarbeiterId = body.user.mitarbeiter_id;
    const vorname = body.user.vorname;
    const nachname = body.user.nachname;
    const uploadedFiles = files || [];

    let message1 = '';

    if (files.length) {
      const savedFiles = await this.userService.updateUserCertificate({
        files: uploadedFiles,
        mitarbeiterId,
        vorname,
        nachname
      });
      // message1 = savedFiles.status === 'success' ? 'Files uploaded' : '';
    }

    return {
      status: 'success',
      message: [message1]
    };
  }
}
