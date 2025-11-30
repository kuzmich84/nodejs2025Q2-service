import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { db } from '../db/db';

@Injectable()
export class ArtistService {
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

  findAll(): Artist[] {
    return db.getAllArtists();
  }

  findOne(id: string): Artist {
    this.validateUuid(id);
    const artist = db.getArtistById(id);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    return artist;
  }

  create(createArtistDto: CreateArtistDto): Artist {
    return db.createArtist(createArtistDto.name, createArtistDto.grammy);
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    this.validateUuid(id);

    const artist = db.getArtistById(id);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    const updated = db.updateArtist(
      id,
      updateArtistDto.name ?? artist.name,
      updateArtistDto.grammy ?? artist.grammy,
    );

    return updated!;
  }

  remove(id: string): void {
    this.validateUuid(id);

    const deleted = db.deleteArtist(id);
    if (!deleted) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }
}
