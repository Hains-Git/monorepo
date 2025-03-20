import { Controller, Post, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { UserService } from './user.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('update_certificate')
  @UseInterceptors(FilesInterceptor('files', 10))
  updateUserCertificate(
    @Body() body: { mitarbeiterId: number; datei_typ_ids: number[] },
    @UploadedFiles() files: Express.Multer.File[] = []
  ) {
    const mitarbeiterId = body.mitarbeiterId;
    const datei_typ_ids = body.datei_typ_ids;

    console.log('Files:', files);
    console.log('Params:', body);

    return this.userService.updateUserCertificate({ mitarbeiterId, datei_typ_ids, files });
  }
}
