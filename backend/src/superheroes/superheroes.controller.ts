import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { SuperheroesService } from './superheroes.service';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';
import { ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('superheroes')
@Controller('superheroes')
export class SuperheroesController {
  constructor(private readonly superheroesService: SuperheroesService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Superhero created' })
  create(@Body() dto: CreateSuperheroDto) {
    return this.superheroesService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 5 })
  @ApiResponse({ status: 200, description: 'List superheroes (paginated)' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 5) {
    return this.superheroesService.findAll(+page, +limit);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Superhero details' })
  findOne(@Param('id') id: string) {
    return this.superheroesService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Superhero updated' })
  update(@Param('id') id: string, @Body() dto: UpdateSuperheroDto) {
    return this.superheroesService.update(id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Superhero deleted' })
  remove(@Param('id') id: string) {
    return this.superheroesService.remove(id);
  }
}
