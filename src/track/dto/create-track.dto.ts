import { IsString, IsInt, IsUUID, IsOptional } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID(4)
  artistId?: string | null;

  @IsOptional()
  @IsUUID(4)
  albumId?: string | null;

  @IsInt()
  duration: number;
}
