import { IsOptional, IsString, Matches, MaxLength, IsNotEmpty } from 'class-validator';

export class UpdateTagDto {
  @IsOptional()
  @IsString()
  @MaxLength(15)
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @Matches(/^#[0-9a-fA-F]{6}$/, { message: 'color must be a hex color, e.g. #808080' })
  color?: string;
}
