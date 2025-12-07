import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { uuidV4Regex } from 'src/utils/uuidV4Regex';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  private isValidUuidV4(id: string): boolean {
    return uuidV4Regex.test(id);
  }

  private validateUuid(id: string): void {
    if (!this.isValidUuidV4(id)) {
      throw new BadRequestException('Invalid UUID v4');
    }
  }

  async findAll() {
    const favs = await this.prisma.favorites.findFirst();
    const favIds = favs || { artists: [], albums: [], tracks: [] };

    const artists = await this.prisma.artist.findMany({
      where: { id: { in: favIds.artists } },
    });
    const albums = await this.prisma.album.findMany({
      where: { id: { in: favIds.albums } },
    });
    const tracks = await this.prisma.track.findMany({
      where: { id: { in: favIds.tracks } },
    });

    return { artists, albums, tracks };
  }

  async addTrack(id: string) {
    this.validateUuid(id);
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track)
      throw new UnprocessableEntityException(
        'Track with such id does not exist',
      );

    const favs =
      (await this.prisma.favorites.findFirst()) ||
      (await this.prisma.favorites.create({ data: {} }));
    if (!favs.tracks.includes(id)) {
      await this.prisma.favorites.update({
        where: { id: favs.id },
        data: { tracks: { push: id } },
      });
    }
  }

  async removeTrack(id: string) {
    this.validateUuid(id);
    const favs = await this.prisma.favorites.findFirst();
    if (!favs || !favs.tracks.includes(id)) {
      throw new NotFoundException('Track is not in favorites');
    }
    await this.prisma.favorites.update({
      where: { id: favs.id },
      data: { tracks: { set: favs.tracks.filter((t) => t !== id) } },
    });
  }

  async addAlbum(id: string): Promise<void> {
    this.validateUuid(id);

    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new UnprocessableEntityException(
        'Album with such id does not exist',
      );
    }

    const favs =
      (await this.prisma.favorites.findFirst()) ||
      (await this.prisma.favorites.create({ data: {} }));
    if (!favs.albums.includes(id)) {
      await this.prisma.favorites.update({
        where: { id: favs.id },
        data: { albums: { push: id } },
      });
    }
  }

  async removeAlbum(id: string): Promise<void> {
    this.validateUuid(id);

    const favs = await this.prisma.favorites.findFirst();

    if (!favs || !favs.albums.includes(id)) {
      throw new NotFoundException('Track is not in favorites');
    }
    await this.prisma.favorites.update({
      where: { id: favs.id },
      data: { albums: { set: favs.albums.filter((t) => t !== id) } },
    });
  }

  async addArtist(id: string): Promise<void> {
    this.validateUuid(id);

    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new UnprocessableEntityException(
        'Artist with such id does not exist',
      );
    }

    const favs =
      (await this.prisma.favorites.findFirst()) ||
      (await this.prisma.favorites.create({ data: {} }));
    if (!favs.artists.includes(id)) {
      await this.prisma.favorites.update({
        where: { id: favs.id },
        data: { artists: { push: id } },
      });
    }
  }

  async removeArtist(id: string): Promise<void> {
    this.validateUuid(id);

    const favs = await this.prisma.favorites.findFirst();
    if (!favs || !favs.artists.includes(id)) {
      throw new NotFoundException('Track is not in favorites');
    }
    await this.prisma.favorites.update({
      where: { id: favs.id },
      data: { artists: { set: favs.artists.filter((t) => t !== id) } },
    });
  }
}
