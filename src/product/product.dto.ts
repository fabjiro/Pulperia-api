import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateImageDto } from '../image/image.dto';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => CreateImageDto)
  picture: CreateImageDto;

  @IsOptional()
  @IsNumber()
  state?: number;
}
export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateImageDto)
  picture?: CreateImageDto;

  @IsOptional()
  @IsNumber()
  state?: number;
}
