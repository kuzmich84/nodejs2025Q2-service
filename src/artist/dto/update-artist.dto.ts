import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateArtistDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  grammy?: boolean;
}
