import { HttpException, Inject, Injectable, Query } from '@nestjs/common';
import {
  CreateCategorieDto,
  FindCategorieFilterDto,
  UpdateCategorieDto,
} from './categorie.dto';
import { Categorie } from './entities/categorie.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StateService } from '../state/state.service';

@Injectable()
export class CategorieService {
  @InjectRepository(Categorie)
  private categorieRepository: Repository<Categorie>;

  @Inject()
  private stateService: StateService;

  async create(createCategorieDto: CreateCategorieDto) {
    const state = await this.stateService.findOne(
      createCategorieDto.state ?? 1,
    );
    return this.categorieRepository.save({
      name: createCategorieDto.name,
      state: state,
    });
  }

  findAll() {
    return this.categorieRepository.find();
  }

  async findAllFilter(@Query() filter: FindCategorieFilterDto) {
    try {
      const categories = await this.categorieRepository.find({
        where: filter,
      });
      return categories;
    } catch (error) {
      throw new HttpException(
        'Hemos tenido problemas al procesar su peticion',
        500,
      );
    }
  }

  async findAllActive() {
    const state = await this.stateService.findOne(1);
    return this.categorieRepository.find({
      where: {
        state,
      },
    });
  }

  async findOne(id: number) {
    const categorie = await this.categorieRepository.findOneBy({
      id,
    });

    if (!categorie) {
      throw new HttpException('Categoria no disponible', 404);
    }
    return categorie;
  }

  async update(id: number, updateCategorieDto: UpdateCategorieDto) {
    await this.findOne(id);
    if (updateCategorieDto.state) {
      const state = await this.stateService.findOne(
        updateCategorieDto.state ?? 1,
      );
      return this.categorieRepository.update(id, {
        state,
      });
    }
    return this.categorieRepository.update(id, {
      name: updateCategorieDto.name,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.categorieRepository.delete(id);
  }
}
