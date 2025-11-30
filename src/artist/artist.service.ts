import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { db } from '../db/db';
import { uuidV4Regex } from 'src/utils/uuidV4Regex';

@Injectable()
export class ArtistService {
  private isValidUuidV4(id: string): boolean {
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
    const artist = db.getArtistById(id);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    const deleted = db.deleteArtist(id);
    if (!deleted) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    db.clearArtistReferences(id);
  }
}
