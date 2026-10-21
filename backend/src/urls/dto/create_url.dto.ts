import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({ protocols: ['https'], require_protocol: true })
  @MaxLength(2000)
  raw_url!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(75)
  notes?: string;
}
