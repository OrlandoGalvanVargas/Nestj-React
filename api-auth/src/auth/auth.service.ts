import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/users/dto/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(userData: {
    email: string;
    name: string;
    phoneNumber: string;
    password: string;
    role?: string;
  }): Promise<User> {
    const { email, name, phoneNumber, password, role } = userData;

    // Verificar si el usuario existe
    const userExist = await this.userRepository.findOne({ where: { email } });
    if (userExist) {
        throw new ConflictException('User already exists');

    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      name,
      phoneNumber,
      password: hashedPassword,
roles: role ? [role] : ['user'],
    });

    return this.userRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    
if (!user || !(await bcrypt.compare(password, user.password))) return null;

    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, roles: Array.isArray(user.roles) ? user.roles : [user.roles]};
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        roles: user.roles,
      },
    };
  }
}
