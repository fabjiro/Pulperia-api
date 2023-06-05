import { HttpException, Injectable } from '@nestjs/common';
import { CreateRolDto, UpdateRolDto } from './rol.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';

@Injectable()
export class RolService {
  @InjectRepository(Rol)
  private rolRepository: Repository<Rol>;

  create(createRolDto: CreateRolDto) {
    return this.rolRepository.save(createRolDto);
  }

  findAll() {
    return this.rolRepository.find();
  }

  async findOne(id: number) {
    const rol = await this.rolRepository.findOneBy({
      id,
    });

    if (rol) {
      throw new HttpException('Rol no disponible', 404);
    }

    return rol;
  }

  async update(id: number, updateRolDto: UpdateRolDto) {
    await this.findOne(id);
    return this.rolRepository.update(id, updateRolDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.rolRepository.delete(id);
  }
}
