import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { db } from '../db/db';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { FavoritesResponseDto } from './dto/favorites-response.dto';

@Injectable()
export class FavoriteService {
  private isValidUuidV4(id: string): boolean {
    const uuidV4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Regex.test(id);
  }

  private validateUuid(id: string): void {
    if (!this.isValidUuidV4(id)) {
      throw new BadRequestException('Invalid UUID v4');
    }
  }

  findAll(): FavoritesResponseDto {
    const favs = db.getFavorites();

    const artists: Artist[] = favs.artists
      .map((id) => db.getArtistById(id))
      .filter(Boolean) as Artist[];

    const albums: Album[] = favs.albums
      .map((id) => db.getAlbumById(id))
      .filter(Boolean) as Album[];

    const tracks: Track[] = favs.tracks
      .map((id) => db.getTrackById(id))
      .filter(Boolean) as Track[];

    return { artists, albums, tracks };
  }

  addTrack(id: string): void {
    this.validateUuid(id);

    const track = db.getTrackById(id);
    if (!track) {
      throw new UnprocessableEntityException(
        'Track with such id does not exist',
      );
    }

    db.addTrackToFavorites(id);
  }

  removeTrack(id: string): void {
    this.validateUuid(id);

    const removed = db.removeTrackFromFavorites(id);
    if (!removed) {
      throw new NotFoundException('Track is not in favorites');
    }
  }

  addAlbum(id: string): void {
    this.validateUuid(id);

    const album = db.getAlbumById(id);
    if (!album) {
      throw new UnprocessableEntityException(
        'Album with such id does not exist',
      );
    }

    db.addAlbumToFavorites(id);
  }

  removeAlbum(id: string): void {
    this.validateUuid(id);

    const removed = db.removeAlbumFromFavorites(id);
    if (!removed) {
      throw new NotFoundException('Album is not in favorites');
    }
  }

  addArtist(id: string): void {
    this.validateUuid(id);

    const artist = db.getArtistById(id);
    if (!artist) {
      throw new UnprocessableEntityException(
        'Artist with such id does not exist',
      );
    }

    db.addArtistToFavorites(id);
  }

  removeArtist(id: string): void {
    this.validateUuid(id);

    const removed = db.removeArtistFromFavorites(id);
    if (!removed) {
      throw new NotFoundException('Artist is not in favorites');
    }
  }
}
