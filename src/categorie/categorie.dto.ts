import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateCategorieDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  state?: number;
}
export class UpdateCategorieDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  state?: number;
}

export class FindCategorieFilterDto {
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
  id?: number;
}
