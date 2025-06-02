import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CreateEncuestaDTO } from '../interfaces/create-encuesta.dto';

@Injectable({
  providedIn: 'root',
})
export class EncuestasService {
  private http = inject(HttpClient);

  //simulacion de la URL base de la API
  private apiUrl = 'https://mi-api-de-encuestas.com/api/encuestas';

  crearEncuesta(encuesta: CreateEncuestaDTO): Observable<any> {
    const respuestaSimulada = {
      id: Math.floor(Math.random() * 1000) + 1,
      codigoRespuesta: 'ABC123',
      codigoResultados: 'XYZ789',
      ...encuesta,
    };

    return of(respuestaSimulada);
  }
}
