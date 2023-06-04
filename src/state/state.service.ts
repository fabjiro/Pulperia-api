import { Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return this.stateRepository.findOneBy({
      id: id,
    });
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
