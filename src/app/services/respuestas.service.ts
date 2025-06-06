import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  BuscarRespuestasDTO,
  CrearRespuestaDTO,
} from '../interfaces/respuesta.dto';

@Injectable({ providedIn: 'root' })
export class RespuestasService {
  private readonly baseUrl = '/api/v1/respuestas';

  constructor(private readonly http: HttpClient) {}

  obtenerRespuestasPaginadasPorEncuesta(
    encuestaId: number,
    codigo: string,
    page = 1,
    limit = 10,
  ): Observable<BuscarRespuestasDTO> {
    const params = new URLSearchParams({
      codigo,
      page: page.toString(),
      limit: limit.toString(),
    });
    const url = `${this.baseUrl}/${encuestaId}/paginadas?${params}`;
    return this.http.get<BuscarRespuestasDTO>(url);
  }

  crearRespuesta(
    encuestaId: number,
    codigo: string,
    payload: CrearRespuestaDTO,
  ): Observable<CrearRespuestaDTO> {
    const url = `${this.baseUrl}/${encuestaId}?codigo=${codigo}&tipo=RESPUESTA`;
    return this.http.post<CrearRespuestaDTO>(url, payload);
  }
}
