import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { EncuestasService } from '../../services/encuestas.service';
import { CreateEncuestaDTO } from '../../interfaces/create-encuesta.dto';
import { EncuestaDTO } from '../../interfaces/encuesta.dto';

import { EncuestaFormComponent } from '../encuesta-form/encuesta-form.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-crear-encuesta',
  standalone: true,
  imports: [EncuestaFormComponent, DialogModule, ButtonModule, QRCodeComponent],
  templateUrl: './crear-encuesta.component.html',
  styleUrl: './crear-encuesta.component.css',
})
export class CrearEncuestaComponent {
  encuesta!: EncuestaDTO;
  linkRespuesta = '';
  linkResultados = '';
  mostrarModal = false;

  mostrarQR: Record<'respuesta' | 'resultados', boolean> = {
    respuesta: false,
    resultados: false,
  };

  constructor(
    private readonly encuestasService: EncuestasService,
    private readonly messageService: MessageService,
    private readonly router: Router,
  ) {}

  toggleQR(tipo: 'respuesta' | 'resultados'): void {
    this.mostrarQR[tipo] = !this.mostrarQR[tipo];
  }

  guardarEncuesta(datos: CreateEncuestaDTO): void {
    this.encuestasService.crearEncuesta(datos).subscribe({
      next: (res) => this.onEncuestaCreada(res),
      error: (err) => this.onErrorCrearEncuesta(err),
    });
  }

  private onEncuestaCreada(encuesta: EncuestaDTO): void {
    this.encuesta = encuesta;
    const origin = window.location.origin;

    this.linkRespuesta = `${origin}/respuesta/${encuesta.id}?codigo=${encuesta.codigoRespuesta}&tipo=RESPUESTA`;
    this.linkResultados = `${origin}/respuestas/${encuesta.id}/paginadas?codigo=${encuesta.codigoResultados}`;
    this.mostrarModal = true;

    this.messageService.add({
      severity: 'success',
      summary: 'Encuesta creada',
    });
  }

  private onErrorCrearEncuesta(error: any): void {
    console.error('Error al crear encuesta:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error al crear la encuesta',
    });
  }

  gestionar(): void {
    this.router.navigate([
      '/encuesta',
      this.encuesta.id,
      this.encuesta.codigoResultados,
      'resultados',
    ]);
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}
