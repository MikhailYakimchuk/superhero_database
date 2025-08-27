import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuperheroesService } from './superheroes.service';
import { SuperheroesController } from './superheroes.controller';
import { Superhero, SuperheroSchema } from './entities/superhero.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Superhero.name, schema: SuperheroSchema }])],
  controllers: [SuperheroesController],
  providers: [SuperheroesService],
})
export class SuperheroesModule {}
