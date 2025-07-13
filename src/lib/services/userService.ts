import { db } from '@/lib/database/db';
import { users, type NewUser, type User } from '@/lib/database/schema';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export class UserService {
  static async createUser(userData: {
    email: string;
    name?: string;
    password?: string;
    provider: string;
    providerId?: string;
    image?: string;
  }): Promise<User> {
    const hashedPassword = userData.password 
      ? await bcrypt.hash(userData.password, 12)
      : null;

    const [user] = await db.insert(users).values({
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      provider: userData.provider,
      providerId: userData.providerId,
      image: userData.image,
    }).returning();

    return user;
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user || null;
  }

  static async findUserById(id: number): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user || null;
  }

  static async findUserByProvider(provider: string, providerId: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.providerId, providerId),
          eq(users.email, providerId) // For OAuth, providerId might be email
        )
      )
      .limit(1);

    return user || null;
  }

  static async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  static async updateUser(id: number, updates: Partial<NewUser>): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return user || null;
  }
} 