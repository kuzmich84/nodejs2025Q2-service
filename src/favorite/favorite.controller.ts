import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { FavoriteService } from './favorite.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
@UseGuards(JwtAuthGuard)
@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.favoriteService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  async addTrack(@Param('id') id: string) {
    return this.favoriteService.addTrack(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param('id') id: string) {
    return this.favoriteService.removeTrack(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  async addAlbum(@Param('id') id: string) {
    return this.favoriteService.addAlbum(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param('id') id: string) {
    return this.favoriteService.removeAlbum(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  async addArtist(@Param('id') id: string) {
    return this.favoriteService.addArtist(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param('id') id: string) {
    return this.favoriteService.removeArtist(id);
  }
}
