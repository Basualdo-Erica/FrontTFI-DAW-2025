import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateEncuestaDTO } from '../interfaces/create-encuesta.dto';
import { Observable } from 'rxjs';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';
import { EncuestaDTO } from '../interfaces/encuesta.dto';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EncuestasService {
  private httpClient = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  crearEncuesta(dto: CreateEncuestaDTO): Observable<{
    id: number;
    codigoRespuesta: string;
    codigoResultados: string;
  }> {
    return this.httpClient.post<{
      id: number;
      codigoRespuesta: string;
      codigoResultados: string;
    }>(`${this.apiUrl}/encuestas`, dto);
  }



  traerEncuesta(
    idEncuesta: number,
    codigo: string,
    tipo: CodigoTipoEnum,
  ): Observable<EncuestaDTO> {
    return this.httpClient.get<EncuestaDTO>(
      `${this.apiUrl}/encuestas/${idEncuesta}?codigo=${codigo}&codigoTipo=${tipo}`
    );
  }
}
