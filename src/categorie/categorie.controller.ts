import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CategorieService } from './categorie.service';
import {
  CreateCategorieDto,
  FindCategorieFilterDto,
  UpdateCategorieDto,
} from './categorie.dto';
import { Roles } from '../rol/decoratos/rols.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../rol/guards/role/role.guard';

@Controller('categorie')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  @Post()
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  create(@Body() createCategorieDto: CreateCategorieDto) {
    return this.categorieService.create(createCategorieDto);
  }

  @Get()
  findAll() {
    return this.categorieService.findAll();
  }

  @Get('/filter')
  findAllFilter(@Query() filter: FindCategorieFilterDto) {
    return this.categorieService.findAllFilter(filter);
  }

  @Get('/actives')
  findAllActives() {
    return this.categorieService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categorieService.findOne(id);
  }

  @Patch(':id')
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  update(
    @Param('id') id: number,
    @Body() updateCategorieDto: UpdateCategorieDto,
  ) {
    return this.categorieService.update(id, updateCategorieDto);
  }

  @Delete(':id')
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  remove(@Param('id') id: number) {
    return this.categorieService.remove(id);
  }
}
