import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl
} from 'class-validator';

export class CreateSuperheroDto {
  @ApiProperty({ example: 'Superman' })
  @IsString()
  nickname: string;

  @ApiProperty({ example: 'Clark Kent' })
  @IsString()
  real_name: string;

  @ApiProperty({ example: 'Born on Krypton...' })
  @IsString()
  @IsOptional()
  origin_description?: string;

  @ApiProperty({ example: ['flight', 'super strength'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  superpowers?: string[];

  @ApiProperty({ example: "It's a bird, it's a plane..." })
  @IsString()
  @IsOptional()
  catch_phrase?: string;

  @ApiProperty({ example: ['https://upload.wikimedia.org/wikipedia/ru/d/d6/Superman_Man_of_Steel.jpg'] })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  images?: string[];
}
