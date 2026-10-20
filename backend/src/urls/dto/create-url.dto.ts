import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(2000)
  raw_url!: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
