import { IsString, IsOptional, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UserVerwaltungDto {
  @IsString()
  @IsNotEmpty()
  mitarbeiter_id: string;

  @IsString()
  @IsNotEmpty()
  nachname: string;

  @IsString()
  @IsNotEmpty()
  vorname: string;

  @IsString()
  @IsNotEmpty()
  account_info_id: string;
}

export class UpdateUserVerwaltungDto {
  @ValidateNested()
  @Type(() => UserVerwaltungDto)
  user: UserVerwaltungDto;
}
