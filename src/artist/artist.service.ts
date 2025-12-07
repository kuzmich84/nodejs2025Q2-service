import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { uuidV4Regex } from 'src/utils/uuidV4Regex';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  private isValidUuidV4(id: string): boolean {
    return uuidV4Regex.test(id);
  }

  private validateUuid(id: string): void {
    if (!this.isValidUuidV4(id)) {
      throw new BadRequestException('Invalid UUID v4');
    }
  }

  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<Artist> {
    this.validateUuid(id);
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.prisma.artist.create({ data: createArtistDto });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    this.validateUuid(id);

    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    const updated = await this.prisma.artist.update({
      where: { id },
      data: updateArtistDto,
    });

    return updated!;
  }

  async remove(id: string): Promise<void> {
    this.validateUuid(id);
    const artist = this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    await this.prisma.track.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });
    await this.prisma.album.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });

    const favs = await this.prisma.favorites.findFirst();
    if (favs) {
      await this.prisma.favorites.update({
        where: { id: favs.id },
        data: { artists: { set: favs.artists.filter((a) => a !== id) } },
      });
    }

    const deleted = await this.prisma.artist.delete({ where: { id } });
    if (!deleted) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }
}
