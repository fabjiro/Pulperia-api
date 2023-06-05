import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRolDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
export class UpdateRolDto {
  @IsOptional()
  @IsString()
  name: string;
}
