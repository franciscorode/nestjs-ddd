import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@src/user/domain/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userRepository.retrieve_by_name(username);
    if (user.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.uuid, username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
