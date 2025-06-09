import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

import { SeccionComponent } from '../seccion/seccion.component';
import { GestionPreguntaDialogComponent } from '../gestion-pregunta-dialog/gestion-pregunta-dialog.component';
import { TextoErrorComponent } from '../texto-error/texto-error.component';
import { EncuestasService } from '../../services/encuestas.service';
import { PreguntaDTO } from '../../interfaces/pregunta.dto';
import { tiposPreguntaPresentacion, TiposRespuestaEnum } from '../../enums/tipos-pregunta.enum';
import { CreateEncuestaDTO } from '../../interfaces/create-encuesta.dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-creacion-encuesta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    ToastModule,
    SeccionComponent,
    GestionPreguntaDialogComponent,
    TextoErrorComponent,
  ],
  templateUrl: './creacion-encuesta.component.html',
  styleUrls: ['./creacion-encuesta.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class CreacionEncuestaComponent {
  form: FormGroup;

  private messageService = inject(MessageService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private encuestasService = inject(EncuestasService);

  dialogGestionPreguntaVisible: boolean = false;


  mostrarModal = false;
  indexPreguntaAEliminar: number | null = null;

  preguntaSeleccionadaParaEdicion: PreguntaDTO | null = null;
  indicePreguntaEditada: number | null = null;

  constructor() {
    this.form = new FormGroup({
      nombre: new FormControl<string>('', Validators.required),
      preguntas: new FormArray<FormControl<PreguntaDTO | null>>(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
    });
  }

  get preguntas(): FormArray<FormControl<PreguntaDTO | null>> {
    return this.form.get('preguntas') as FormArray<FormControl<PreguntaDTO | null>>;
  }

  get nombre(): FormControl<string> {
    return this.form.get('nombre') as FormControl<string>;
  }

  abrirDialog() {
    this.preguntaSeleccionadaParaEdicion = null;
    this.indicePreguntaEditada = null;
    this.dialogGestionPreguntaVisible = true;

  }

  editarPregunta(index: number) {
    const pregunta = this.preguntas.at(index).value;
    if (pregunta) {
      this.preguntaSeleccionadaParaEdicion = {
        texto: pregunta.texto ?? '',
        tipo: pregunta.tipo ?? TiposRespuestaEnum.ABIERTA, 
        opciones: pregunta.opciones ?? [],
        numero: pregunta.numero,
      };
      this.indicePreguntaEditada = index;
      this.dialogGestionPreguntaVisible = true;

    }
  }

  onPreguntaCreada(pregunta: PreguntaDTO) {
    if (this.indicePreguntaEditada !== null) {
      const numeroOriginal = this.preguntas.at(this.indicePreguntaEditada).value?.numero ?? (this.indicePreguntaEditada + 1);
      pregunta.numero = numeroOriginal;

      this.preguntas.at(this.indicePreguntaEditada).patchValue(pregunta);
      this.messageService.add({
        severity: 'success',
        summary: 'Pregunta editada',
        detail: '¡La pregunta se actualizó con éxito!',
      });

      this.indicePreguntaEditada = null;
      this.preguntaSeleccionadaParaEdicion = null;
    } else {
      const numeroPregunta = this.preguntas.length + 1; 
      pregunta.numero = numeroPregunta;
      this.agregarPregunta(pregunta);
    }
    this.dialogGestionPreguntaVisible = false;

  }


  onDialogClose() {
    this.dialogGestionPreguntaVisible = false;
    this.preguntaSeleccionadaParaEdicion = null;
    this.indicePreguntaEditada = null;
  }

  agregarPregunta(pregunta: PreguntaDTO) {
    this.preguntas.push(new FormControl<PreguntaDTO | null>(pregunta));
    this.preguntas.updateValueAndValidity();
  }

  confirmarEliminarPregunta(index: number) {
    this.indexPreguntaAEliminar = index;
    this.mostrarModal = true;
  }

  cancelarEliminacion() {
    this.mostrarModal = false;
    this.indexPreguntaAEliminar = null;
  }

  confirmarEliminacion() {
    if (this.indexPreguntaAEliminar !== null) {
      this.eliminarPregunta(this.indexPreguntaAEliminar);
    }
    this.cancelarEliminacion();
  }

  eliminarPregunta(index: number) {
    this.preguntas.removeAt(index);
    this.preguntas.controls.forEach((control, i) => {
      if (control.value) control.setValue({ ...control.value, numero: i + 1 });
    });
  }

  getTipoPreguntaPresentacion(tipo: string): string {
  switch(tipo) {
    case 'ABIERTA': 
      return 'Abierta';
    case 'OPCION_MULTIPLE_SELECCION_SIMPLE':
      return 'Una sola opción';
    case 'OPCION_MULTIPLE_SELECCION_MULTIPLE':
      return 'Varias opciones';
    default: 
      return tipo; 
  }
}




  confirmarCrearEncuesta() {
    this.confirmationService.confirm({
      message: 'Confirmar creación de encuesta?',
      header: 'Confirmación',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => this.crearEncuesta(),
    });
  }

  crearEncuesta() {
  if (!this.form.valid) {
    this.form.markAllAsTouched();
    this.messageService.add({ severity: 'error', summary: 'Hay errores en el formulario' });
    return;
  }

  const encuesta: CreateEncuestaDTO = {
    ...this.form.value,
    estado: 'PUBLICADO',
  };

  encuesta.preguntas.forEach((pregunta, i) => {
    pregunta.numero = i + 1;
    pregunta.opciones?.forEach((op, j) => op.numero = j + 1);
  });

  console.log('Payload para enviar:', encuesta); //esto para chusmear el payload en consola

  this.encuestasService.crearEncuesta(encuesta).subscribe({
    next: (res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'La encuesta se creó con éxito',
      });
      this.form.reset();
      this.preguntas.clear();
      this.router.navigateByUrl(
        `/enlaces?participationLink=${res.codigoRespuesta}&resultsLink=${res.codigoResultados}`
      );


    },
    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al crear la encuesta',
      });
    },
  });
}

  }

