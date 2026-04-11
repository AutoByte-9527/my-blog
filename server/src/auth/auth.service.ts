import { Injectable, UnauthorizedException, ConflictException, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUser } from './entities/admin-user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(AdminUser)
    private adminUserRepository: Repository<AdminUser>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    // 自动创建环境变量预设的管理员
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminUsername && adminPassword) {
      const existing = await this.adminUserRepository.findOne({ where: { username: adminUsername } });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const admin = this.adminUserRepository.create({
          username: adminUsername,
          password: hashedPassword,
          nickname: '管理员',
        });
        await this.adminUserRepository.save(admin);
        console.log(`[Auth] Created admin user: ${adminUsername}`);
      }
    }
  }

  async register(dto: RegisterDto) {
    const existing = await this.adminUserRepository.findOne({ where: { username: dto.username } });
    if (existing) {
      throw new ConflictException('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.adminUserRepository.create({
      username: dto.username,
      password: hashedPassword,
      nickname: dto.nickname,
    });

    await this.adminUserRepository.save(user);
    return { id: user.id, username: user.username, nickname: user.nickname };
  }

  async login(dto: LoginDto) {
    const user = await this.adminUserRepository.findOne({ where: { username: dto.username } });
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, username: user.username, nickname: user.nickname },
    };
  }

  async getProfile(userId: number) {
    const user = await this.adminUserRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return { id: user.id, username: user.username, nickname: user.nickname };
  }
}
