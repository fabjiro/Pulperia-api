import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { RolService } from '../rol/rol.service';
import { ImageService } from '../image/image.service';
import { SecurityService } from '../service/security/security.service';

@Injectable()
export class ProfileService {
  @InjectRepository(Profile)
  private profileRepository: Repository<Profile>;

  @Inject()
  private rolService: RolService;

  @Inject()
  private imageService: ImageService;

  @Inject()
  private stateService: ImageService;

  @Inject(SecurityService)
  private securityService: SecurityService;

  async create(createProfileDto: CreateProfileDto) {
    const { rol, state, picture } = createProfileDto;
    const defaultRol = await this.rolService.findOne(rol ?? 3);
    const defaultState = await this.stateService.findOne(state ?? 1);
    const hasPassword = await this.securityService.plainTextEncrypt(
      createProfileDto.password,
    );

    const profile = await this.profileRepository.create({
      name: createProfileDto.name,
      password: hasPassword,
      email: createProfileDto.email,
      state: defaultState,
      rol: defaultRol,
    });

    if (picture) {
      const upImage = await this.imageService.create('Profile', picture);
      profile.image = upImage;
    }

    return this.profileRepository.save(profile);
  }

  findAll() {
    return this.profileRepository.find({
      select: ['email', 'id', 'image', 'name', 'rol', 'state', 'trust'],
    });
  }

  async findOne(id: number) {
    const profile = await this.profileRepository.findOneBy({ id });
    if (!profile) {
      throw new HttpException('Perfil no disponible', 404);
    }
    return profile;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.profileRepository.delete(id);
  }
}
