import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ReplaceMediaDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  altText?: string;
}
