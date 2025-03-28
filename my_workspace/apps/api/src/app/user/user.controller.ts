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

    let message1 = [];

    if (files.length) {
      const savedFiles = await this.userService.updateUserCertificate({
        files: uploadedFiles,
        mitarbeiterId,
        vorname,
        nachname
      });
      console.log('Saved Files:', savedFiles);
      message1 = savedFiles;
    }

    return {
      message: message1
    };
  }
}
