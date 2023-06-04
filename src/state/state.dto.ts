import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStateDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateStateDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
