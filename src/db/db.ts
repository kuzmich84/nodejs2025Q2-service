import { User } from 'src/user/entities/users.entity';

export class Artist {
  id: string;
  name: string;
  grammy: boolean;

  constructor(partial: Partial<Artist> = {}) {
    Object.assign(this, partial);
  }
}

export class Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;

  constructor(partial: Partial<Album> = {}) {
    Object.assign(this, partial);
  }
}

class Database {
  private users: User[] = [];
  private artists: Artist[] = [];
  private albums: Album[] = [];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  create(login: string, password: string): User {
    const now = Date.now();
    const user = new User();
    user.id = crypto.randomUUID();
    user.login = login;
    user.password = password;
    user.version = 1;
    user.createdAt = now;
    user.updatedAt = now;

    this.users.push(user);
    return user;
  }

  updatePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): User | null {
    const user = this.findOne(id);
    if (!user) return null;
    if (user.password !== oldPassword) return null;

    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    return user;
  }

  delete(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
  getAllArtists(): Artist[] {
    return this.artists;
  }

  getArtistById(id: string): Artist | undefined {
    return this.artists.find((a) => a.id === id);
  }

  createArtist(name: string, grammy: boolean): Artist {
    const artist = new Artist({
      id: crypto.randomUUID(),
      name,
      grammy,
    });
    this.artists.push(artist);
    return artist;
  }

  updateArtist(id: string, name: string, grammy: boolean): Artist | null {
    const artist = this.getArtistById(id);
    if (!artist) return null;

    artist.name = name;
    artist.grammy = grammy;
    return artist;
  }

  deleteArtist(id: string): boolean {
    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.artists.splice(index, 1);
    return true;
  }

  getAllAlbums(): Album[] {
    return this.albums;
  }

  getAlbumById(id: string): Album | undefined {
    return this.albums.find((a) => a.id === id);
  }

  createAlbum(name: string, year: number, artistId: string | null): Album {
    const album = new Album({
      id: crypto.randomUUID(),
      name,
      year,
      artistId,
    });
    this.albums.push(album);
    return album;
  }

  updateAlbum(
    id: string,
    name: string,
    year: number,
    artistId: string | null,
  ): Album | null {
    const album = this.getAlbumById(id);
    if (!album) return null;

    album.name = name;
    album.year = year;
    album.artistId = artistId;
    return album;
  }

  deleteAlbum(id: string): boolean {
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.albums.splice(index, 1);
    return true;
  }
}

export const db = new Database();
