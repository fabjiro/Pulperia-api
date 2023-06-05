import { Type } from 'class-transformer';
import {
  IsBase64,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateImageDto } from '../image/image.dto';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Contraseña debil',
  })
  password: string;

  @IsOptional()
  @IsNumber()
  rol?: number;

  @IsOptional()
  @IsNumber()
  state?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateImageDto)
  picture?: CreateImageDto;
}
export class UpdateProfileDto {}
