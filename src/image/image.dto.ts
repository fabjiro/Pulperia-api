import { IsBase64, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateImageDto {
  @IsNotEmpty()
  @IsBase64()
  image: string;

  @IsBoolean()
  @IsOptional()
  compresed: boolean;
}
