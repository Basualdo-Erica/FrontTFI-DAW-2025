import { TiposRespuestaEnum } from '../enums/tipos-pregunta.enum';
import { OpcionDTO } from './opcion.dto';

export interface PreguntaDTO {
  texto: string;
  tipo: TiposRespuestaEnum;
  opciones?: OpcionDTO[];
  numero?: number;
}
