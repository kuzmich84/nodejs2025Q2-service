import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { db } from '../db/db';
import { uuidV4Regex } from 'src/utils/uuidV4Regex';
import { Album } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  private isValidUuidV4(id: string): boolean {
    return uuidV4Regex.test(id);
  }

  private validateUuid(id: string): void {
    if (!this.isValidUuidV4(id)) {
      throw new BadRequestException('Invalid UUID v4');
    }
  }

  async findAll(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album> {
    this.validateUuid(id);
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return album;
  }

  async create(dto: CreateAlbumDto): Promise<Album> {
    return this.prisma.album.create({
      data: { ...dto, artistId: dto.artistId ?? null },
    });
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
    this.validateUuid(id);
    return this.prisma.album.update({
      where: { id },
      data: { ...dto, artistId: dto.artistId ?? undefined },
    });
  }

  async remove(id: string): Promise<void> {
    this.validateUuid(id);
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException(`Album with id ${id} not found`);

    await this.prisma.track.updateMany({
      where: { albumId: id },
      data: { albumId: null },
    });

    const favs = await this.prisma.favorites.findFirst();
    if (favs) {
      await this.prisma.favorites.update({
        where: { id: favs.id },
        data: { albums: { set: favs.albums.filter((a) => a !== id) } },
      });
    }

    await this.prisma.album.delete({ where: { id } });
  }
}
