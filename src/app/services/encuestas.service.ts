import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateEncuestaDTO } from '../interfaces/create-encuesta.dto';
import { EncuestaDTO } from '../interfaces/encuesta.dto';
import { EliminarPreguntasDTO } from '../interfaces/eliminar-pregunta.dto';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';

interface EncuestasResponse {
  total: number;
  page: number;
  limit: number;
  data: EncuestaDTO[];
  message: string;
}

@Injectable({ providedIn: 'root' })
export class EncuestasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/encuestas';

  crearEncuesta(dto: CreateEncuestaDTO): Observable<EncuestaDTO> {
    return this.http.post<EncuestaDTO>(this.baseUrl, dto);
  }

  buscarEncuesta(
    id: number,
    codigo: string,
    tipo: CodigoTipoEnum,
  ): Observable<EncuestaDTO> {
    const url = `${this.baseUrl}/${id}?codigo=${codigo}&tipo=${tipo}`;
    return this.http.get<EncuestaDTO>(url);
  }

  obtenerEncuestas(
    page = 1,
    limit = 3,
  ): Observable<EncuestasResponse> {
    const url = `${this.baseUrl}?page=${page}&limit=${limit}`;
    return this.http.get<EncuestasResponse>(url);
  }

  cambiarEstado(
    id: number,
    codigo: string,
    tipo: CodigoTipoEnum,
    accion: 'publicar' | 'eliminar',
  ): Observable<{ affected: number }> {
    const url = `${this.baseUrl}/${id}/${accion}?codigo=${codigo}&tipo=${tipo}`;
    return this.http.patch<{ affected: number }>(url, {});
  }

  eliminarPreguntas(
    id: number,
    codigo: string,
    tipo: CodigoTipoEnum,
    payload: EliminarPreguntasDTO,
  ): Observable<unknown> {
    const url = `${this.baseUrl}/${id}/eliminar-preguntas?codigo=${codigo}&tipo=${tipo}`;
    return this.http.patch<unknown>(url, payload);
  }
}
