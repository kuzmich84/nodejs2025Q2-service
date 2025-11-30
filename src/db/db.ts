import { User } from 'src/user/entities/users.entity';

class Database {
  private users: User[] = [];

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
}

export const db = new Database();
