import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProfileService } from '../profile/profile.service';
import { LoginAuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../profile/entities/profile.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto } from '../profile/profile.dto';
import { SecurityService } from '../service/security/security.service';

@Injectable()
export class AuthService {
  @InjectRepository(Profile)
  private profileRepository: Repository<Profile>;

  @Inject(SecurityService)
  private readonly securityService: SecurityService;

  @Inject(ProfileService)
  private readonly profileService: ProfileService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  async login(loginAuthDto: LoginAuthDto) {
    const profile = await this.profileRepository.findOneBy({
      email: loginAuthDto.email,
    });
    const isValid = await this.securityService.compareTextHasg(
      loginAuthDto.password,
      profile.password,
    );

    if (!isValid) throw new HttpException('Credenciales invalidas', 404);

    const sessionToken = this.jwtService.sign({
      id: profile.id,
    });
    const refreshToken = this.jwtService.sign(
      {
        id: profile.id,
      },
      {
        expiresIn: '7d',
      },
    );

    const refetchProfile = await this.profileRepository.findOne({
      select: ['email', 'id', 'image', 'name', 'rol', 'state', 'trust'],
      where: {
        id: profile.id,
      },
    });

    return {
      profile: refetchProfile,
      isAdmin: refetchProfile.rol.id === 1,
      sessionToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const profile = await this.profileRepository.findOneBy({
        id: payload.id,
      });

      const sessionToken = this.jwtService.sign({
        id: profile.id,
      });
      const newrefreshToken = this.jwtService.sign(
        {
          id: profile.id,
        },
        {
          expiresIn: '7d',
        },
      );

      return {
        sessionToken,
        refreshToken: newrefreshToken,
      };
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.BAD_REQUEST);
    }
  }

  async create(createProfileDto: CreateProfileDto) {
    const profile = await this.profileService.create(createProfileDto);

    const sessionToken = this.jwtService.sign({
      id: profile.id,
    });
    const refreshToken = this.jwtService.sign(
      {
        id: profile.id,
      },
      {
        expiresIn: '7d',
      },
    );

    return {
      profile: await this.profileRepository.findOne({
        select: ['email', 'id', 'image', 'name', 'rol', 'state', 'trust'],
        where: {
          id: profile.id,
        },
      }),
      sessionToken,
      refreshToken,
    };
  }

  async me(idProfile: number) {
    const profile = await this.profileRepository.findOne({
      select: ['email', 'id', 'image', 'name', 'rol', 'state', 'trust'],
      where: {
        id: idProfile,
      },
    });

    return {
      ...profile,
      isAdmin: profile.state.id === 1,
    };
  }

  async validateProfile(idProfile: number) {
    const profile = await this.profileRepository.findOne({
      select: ['email', 'id', 'image', 'name', 'rol', 'state', 'trust'],
      where: {
        id: idProfile,
      },
    });
    if (!profile) return;
    return profile;
  }
}
