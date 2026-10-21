import { IsInt } from 'class-validator';

// used by both POST (create the link) and DELETE (identify it): same two fields either way
export class TagUrlDto {
  @IsInt()
  url_id!: number;

  @IsInt()
  tag_id!: number;
}
