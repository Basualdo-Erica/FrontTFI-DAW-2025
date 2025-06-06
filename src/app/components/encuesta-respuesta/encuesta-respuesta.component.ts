import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

import { EncuestaDTO } from '../../interfaces/encuesta.dto';
import { PreguntaDTO } from '../../interfaces/pregunta.dto';
import {
  CrearRespuestaDTO,
  RespuestaAbierta,
  RespuestaOpcion,
} from '../../interfaces/respuesta.dto';

import { RespuestasService } from '../../services/respuestas.service';
import { EncuestasService } from '../../services/encuestas.service';
import { CodigoTipoEnum } from '../../enums/codigo-tipo.enum';

@Component({
  standalone: true,
  selector: 'app-encuesta-respuesta',
  templateUrl: './encuesta-respuesta.component.html',
  styleUrl: './encuesta-respuesta.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PanelModule,
    CardModule,
    InputTextModule,
    ButtonModule,
  ],
})
export class EncuestaRespuestaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly encuestasService = inject(EncuestasService);
  private readonly respuestasService = inject(RespuestasService);
  private readonly messageService = inject(MessageService);

  encuesta!: EncuestaDTO;
  preguntas: PreguntaDTO[] = [];
  form: FormGroup = this.fb.group({});

  id!: number;
  codigo!: string;
  tipo!: string;

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.codigo = this.route.snapshot.queryParamMap.get('codigo')!;
    this.tipo = this.route.snapshot.queryParamMap.get('tipo')!;

    this.cargarEncuesta();
  }

  private cargarEncuesta(): void {
    this.encuestasService
      .buscarEncuesta(this.id, this.codigo, CodigoTipoEnum.RESPUESTA)
      .subscribe({
        next: (data) => {
          this.encuesta = data;
          this.preguntas = data.preguntas;
          this.crearFormulario();
        },
        error: (err) => {
          console.error('Error al cargar encuesta', err);
        },
      });
  }

  private crearFormulario(): void {
    this.preguntas.forEach((p) => {
      const control = p.tipo === 'OPCION_MULTIPLE_SELECCION_MULTIPLE'
        ? new FormControl<number[]>([])
        : new FormControl<string | number>('');
      this.form.addControl(p.id.toString(), control);
    });
  }

  isChecked(preguntaId: number, opcionId: number): boolean {
    const value = this.form.get(preguntaId.toString())?.value;
    return Array.isArray(value) && value.includes(opcionId);
  }

  onCheckboxChange(preguntaId: number, opcionId: number, event: Event): void {
    const control = this.form.get(preguntaId.toString());
    if (!control) return;

    const checked = (event.target as HTMLInputElement).checked;
    const valores: number[] = Array.isArray(control.value) ? [...control.value] : [];

    checked
      ? valores.push(opcionId)
      : control.setValue(valores.filter((v) => v !== opcionId));

    if (checked) control.setValue(valores);
  }

  enviarRespuestas(): void {
    const respuestasAbiertas: RespuestaAbierta[] = [];
    const respuestasOpciones: RespuestaOpcion[] = [];

    Object.entries(this.form.value).forEach(([id, valor]) => {
      const idPregunta = Number(id);
      const pregunta = this.preguntas.find((p) => p.id === idPregunta);
      if (!pregunta) return;

      switch (pregunta.tipo) {
        case 'ABIERTA':
          if (typeof valor === 'string' && valor.trim()) {
            respuestasAbiertas.push({ idPregunta, texto: valor.trim() });
          }
          break;

        case 'OPCION_MULTIPLE_SELECCION_SIMPLE':
          if (valor) {
            respuestasOpciones.push({ idOpcion: Number(valor) });
          }
          break;

        case 'OPCION_MULTIPLE_SELECCION_MULTIPLE':
          if (Array.isArray(valor)) {
            valor.forEach((idOpcion: number) => {
              respuestasOpciones.push({ idOpcion });
            });
          }
          break;
      }
    });

    const payload: CrearRespuestaDTO = {};
    if (respuestasAbiertas.length) payload.respuestasAbiertas = respuestasAbiertas;
    if (respuestasOpciones.length) payload.respuestasOpciones = respuestasOpciones;

    this.respuestasService
      .crearRespuesta(this.encuesta.id, this.encuesta.codigoRespuesta, payload)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Respuesta guardada',
          });
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error al enviar respuestas:', err);
        },
      });
  }
}
