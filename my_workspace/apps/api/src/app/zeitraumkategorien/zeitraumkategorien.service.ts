import { Injectable } from '@nestjs/common';
import { Zeitraumkategorie } from '@my-workspace/models';

@Injectable()
export class ZeitraumkategorienService {
  async preview(year: string | number) {
    return await Zeitraumkategorie.previewZeitraumkategorien(year);
  }
}
