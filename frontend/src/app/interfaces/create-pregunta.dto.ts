import { TiposRespuestaEnum } from '../enums/tipos-pregunta.enum';
import { CreateOpcionDTO } from './create-opcion.dto';

export interface CreatePreguntaDTO {
  texto: string;
  numero: number;
  tipo: TiposRespuestaEnum;
  opciones?: CreateOpcionDTO[];
}
