import { IsString, IsInt, IsUUID, IsOptional } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsUUID(4)
  artistId?: string | null;

  @IsOptional()
  @IsUUID(4)
  albumId?: string | null;

  @IsInt()
  @IsOptional()
  duration?: number;
}
