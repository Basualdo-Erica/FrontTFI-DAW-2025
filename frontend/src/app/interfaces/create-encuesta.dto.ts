import { CreatePreguntaDTO } from './create-pregunta.dto';

export interface CreateEncuestaDTO {
  nombre: string;
  preguntas: CreatePreguntaDTO[];
   estado: string; 
}
