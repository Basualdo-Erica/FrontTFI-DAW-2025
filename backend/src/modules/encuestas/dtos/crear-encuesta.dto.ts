import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CrearPreguntaDTO } from './crear-pregunta.dto';
import { Type } from 'class-transformer';
import { TipoEstadoEnum } from '../enums/tipo-estado.enum';

export class CrearEncuestaDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ enum: [TipoEstadoEnum.PUBLICADO] })
  @IsIn([TipoEstadoEnum.PUBLICADO])  
  estado: TipoEstadoEnum;

  @ApiProperty({ type: [CrearPreguntaDTO] })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CrearPreguntaDTO)
  preguntas: CrearPreguntaDTO[];
}
