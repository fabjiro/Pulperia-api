import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateImageDto } from '../image/image.dto';
import { Type } from 'class-transformer';

export class PaginationProductDto {
  @IsNotEmpty()
  @IsNumberString()
  page: number;

  @IsNotEmpty()
  @IsNumberString()
  pageSize: number;
}

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  categorie: number;

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
  @IsNumber()
  categorie?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateImageDto)
  picture?: CreateImageDto;

  @IsOptional()
  @IsNumber()
  state?: number;
}
export class FindProductFilterDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  'state.id'?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  'categorie.id'?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  id?: number;
}
