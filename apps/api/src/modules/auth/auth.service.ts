import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../repositories/user.repository';
import { RefreshTokenRepository } from '../../repositories/refresh-token.repository';
import * as bcrypt from 'bcrypt';
import { LoginDto, SignupDto, RefreshTokenDto } from './dto/auth.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userRepository: UserRepository,
    private refreshTokenRepository: RefreshTokenRepository,
    private jwtService: JwtService,
  ) {}

  async signup(data: SignupDto) {
    const existingUser = await this.userRepository.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      this.logger.warn(`Signup attempt with existing email: ${data.email}`);
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || 'USER',
      },
    });

    this.logger.log(`New user signed up: ${user.email}`);
    return this.generateTokens(user);
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      this.logger.warn(`Failed login attempt for: ${data.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User logged in: ${user.email}`);
    return this.generateTokens(user);
  }

  async refreshToken(data: RefreshTokenDto) {
    const token = (await this.refreshTokenRepository.findUnique({
      where: { token: data.refreshToken },
      include: { user: true },
    })) as any;

    if (!token || token.revokedAt || token.expiresAt < new Date()) {
      this.logger.warn(`Invalid or expired refresh token used: ${data.refreshToken}`);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.refreshTokenRepository.update({
      where: { id: token.id },
      data: { revokedAt: new Date() },
    });

    this.logger.log(`Token rotated for user: ${token.user.email}`);
    return this.generateTokens(token.user);
  }

  async logout(refreshToken: string) {
    await this.refreshTokenRepository.updateMany({
      where: { token: refreshToken },
      data: { revokedAt: new Date() },
    });
    this.logger.log(`User logged out via token revocation`);
  }

  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuidv4();

    await this.refreshTokenRepository.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
