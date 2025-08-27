import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Superhero, SuperheroDocument } from './entities/superhero.entity';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';

@Injectable()
export class SuperheroesService {
  constructor(
    @InjectModel(Superhero.name)
    private superheroModel: Model<SuperheroDocument>,
  ) { }

  async create(dto: CreateSuperheroDto): Promise<Superhero> {
    const hero = new this.superheroModel(dto);
    return hero.save();
  }

  async findAll(page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const heroes = await this.superheroModel
      .find()
      .skip(skip)
      .limit(limit)
      .select('nickname images')
      .exec();

    const total = await this.superheroModel.countDocuments();
    return {
      data: heroes.map((h) => ({
        id: h._id,
        nickname: h.nickname,
        image: h.images?.[0] || null,
      })),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Superhero> {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID format');
    const hero = await this.superheroModel.findById(id).exec();
    if (!hero) throw new NotFoundException('Superhero not found');
    return hero;
  }

  async update(id: string, dto: UpdateSuperheroDto): Promise<Superhero> {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID format');
    const hero = await this.superheroModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!hero) throw new NotFoundException('Superhero not found');
    return hero;
  }

  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID format');
    const hero = await this.superheroModel.findByIdAndDelete(id);
    if (!hero) throw new NotFoundException('Superhero not found');
  }
}
