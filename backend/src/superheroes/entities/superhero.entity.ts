import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SuperheroDocument = Superhero & Document;

@Schema({ timestamps: true })
export class Superhero {
  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true })
  real_name: string;

  @Prop()
  origin_description: string;

  @Prop({ type: [String] })
  superpowers: string[];

  @Prop()
  catch_phrase: string;

  @Prop({ type: [String] })
  images: string[];
}

export const SuperheroSchema = SchemaFactory.createForClass(Superhero);
