import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { db } from '../db/db';
import { uuidV4Regex } from 'src/utils/uuidV4Regex';
import { Track } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  private isValidUuidV4(id: string): boolean {
    return uuidV4Regex.test(id);
  }

  private validateUuid(id: string): void {
    if (!this.isValidUuidV4(id)) {
      throw new BadRequestException('Invalid UUID v4');
    }
  }

  async findAll(): Promise<Track[]> {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<Track> {
    this.validateUuid(id);
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) throw new NotFoundException(`Track with id ${id} not found`);
    return track;
  }

  async create(dto: CreateTrackDto): Promise<Track> {
    return this.prisma.track.create({
      data: {
        ...dto,
        artistId: dto.artistId ?? null,
        albumId: dto.albumId ?? null,
      },
    });
  }

  async update(id: string, dto: UpdateTrackDto): Promise<Track> {
    this.validateUuid(id);
    return this.prisma.track.update({
      where: { id },
      data: {
        ...dto,
        artistId: dto.artistId ?? undefined,
        albumId: dto.albumId ?? undefined,
      },
    });
  }

  async remove(id: string): Promise<void> {
    this.validateUuid(id);
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) throw new NotFoundException(`Track with id ${id} not found`);

    const favs = await this.prisma.favorites.findFirst();
    if (favs) {
      await this.prisma.favorites.update({
        where: { id: favs.id },
        data: { tracks: { set: favs.tracks.filter((t) => t !== id) } },
      });
    }

    await this.prisma.track.delete({ where: { id } });
  }
}
