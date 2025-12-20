import { IsString, IsInt, IsUUID, IsOptional } from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  year?: number;

  @IsOptional()
  @IsUUID(4, { message: 'artistId must be a valid UUID v4 or null' })
  artistId?: string | null;
}
