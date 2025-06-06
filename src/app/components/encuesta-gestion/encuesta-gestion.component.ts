import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';

import { EncuestasService } from '../../services/encuestas.service';
import { CodigoTipoEnum } from '../../enums/codigo-tipo.enum';
import { EncuestaDTO } from '../../interfaces/encuesta.dto';

@Component({
  selector: 'app-encuesta-gestion',
  standalone: true,
  templateUrl: './encuesta-gestion.component.html',
  styleUrls: ['./encuesta-gestion.component.css'],
  imports: [
    CommonModule,
    PanelModule,
    ButtonModule,
    SelectModule,
    FormsModule,
    DialogModule,
    CardModule,
  ],
})
export class EncuestaGestionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly encuestasService = inject(EncuestasService);

  encuesta: EncuestaDTO | null = null;
  linkRespuesta = '';
  linkResultados = '';
  cargando = true;
  error = '';
  modalEliminar = false;

  constructor(
    private readonly router: Router,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const codigo = this.route.snapshot.paramMap.get('codigo');

    if (!id || !codigo) {
      this.error = 'Datos inválidos';
      this.cargando = false;
      return;
    }

    this.encuestasService.buscarEncuesta(id, codigo, CodigoTipoEnum.RESULTADOS).subscribe({
      next: (data) => {
        this.encuesta = data;
        this.linkRespuesta = `${window.location.origin}/respuesta/${data.id}?codigo=${data.codigoRespuesta}&tipo=RESPUESTA`;
        this.linkResultados = `${window.location.origin}/respuestas/${data.id}/paginadas?codigo=${data.codigoResultados}`;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener encuesta:', err);
        this.error = 'No se pudo cargar la encuesta';
        this.cargando = false;
      },
    });
  }

  irARespuestas(): void {
    if (!this.encuesta) return;

    this.router.navigate(
      ['/respuestas', this.encuesta.id, 'paginadas'],
      { queryParams: { codigo: this.encuesta.codigoResultados } }
    );
  }

  eliminarEncuesta(): void {
    if (!this.encuesta) return;

    this.encuestasService
      .cambiarEstado(
        this.encuesta.id,
        this.encuesta.codigoResultados,
        CodigoTipoEnum.RESULTADOS,
        'eliminar',
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Encuesta eliminada',
            life: 3000,
          });
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error al eliminar encuesta:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error al eliminar la encuesta',
            life: 3000,
          });
        },
      });
  }
}
