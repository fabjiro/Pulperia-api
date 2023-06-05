import { HttpException, Injectable } from '@nestjs/common';
import { CreateStateDto, UpdateStateDto } from './state.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { State } from './entities/state.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StateService {
  @InjectRepository(State)
  private stateRepository: Repository<State>;

  create(createStateDto: CreateStateDto) {
    return this.stateRepository.save(createStateDto);
  }

  findAll() {
    return this.stateRepository.find();
  }

  async findOne(id: number) {
    const state = await this.stateRepository.findOneBy({
      id: id,
    });

    if (!state) {
      throw new HttpException('Estado no disponible', 404);
    }

    return state;
  }

  update(id: number, updateStateDto: UpdateStateDto) {
    return this.stateRepository.update(id, updateStateDto);
  }

  remove(id: number) {
    return this.stateRepository.delete({
      id: id,
    });
  }
}
