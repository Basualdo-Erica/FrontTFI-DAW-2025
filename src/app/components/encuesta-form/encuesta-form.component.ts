import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { IftaLabelModule } from 'primeng/iftalabel';

import { MessageService } from 'primeng/api';

import { tiposPreguntaCadena, TiposRespuestaEnum } from '../../enums/tipos-pregunta.enum';
import { tipoEstadoEnumCadena, TiposEstadoEnum } from '../../enums/tipo-estado.enum';
import { EncuestaDTO } from '../../interfaces/encuesta.dto';
import { CreateEncuestaDTO } from '../../interfaces/create-encuesta.dto';

@Component({
  selector: 'app-encuesta-form',
  standalone: true,
  templateUrl: './encuesta-form.component.html',
  providers: [MessageService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    ToastModule,
    PanelModule,
    IftaLabelModule,
  ],
})
export class EncuestaFormComponent implements OnInit {
  @Input() encuesta?: EncuestaDTO;
  @Input() mostrarModal: boolean = false;
  @Output() guardarEncuestaCreada = new EventEmitter<CreateEncuestaDTO>();

  encuestaForm: FormGroup;
  preguntasAEliminar: number[] = [];

  tiposRespuestaEnum = TiposRespuestaEnum;
  tiposEstadoEnum = TiposEstadoEnum;

  constructor(
    private readonly fb: FormBuilder,
    private readonly location: Location,
  ) {
    this.encuestaForm = this.fb.group({
      nombre: ['', Validators.required],
      estado: [TiposEstadoEnum.PUBLICADO, Validators.required],
      preguntas: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this.encuesta) {
      this.encuestaForm.patchValue({ nombre: this.encuesta.nombre });
    } else {
      this.agregarPregunta();
    }
  }

  get preguntas(): FormArray {
    return this.encuestaForm.get('preguntas') as FormArray;
  }

  getTiposPreguntaCadena() {
    return tiposPreguntaCadena;
  }

  getTiposEstado() {
    return tipoEstadoEnumCadena.filter(
      (item) => item.estado === TiposEstadoEnum.PUBLICADO,
    );
  }

  agregarPregunta(): void {
    const numeroMax = this.encuesta?.preguntas?.reduce(
      (max, p) => Math.max(max, p.numero || 0),
      0,
    ) ?? 0;

    const preguntaForm = this.fb.group({
      numero: [numeroMax + this.preguntas.length + 1],
      texto: ['', Validators.required],
      tipo: ['', Validators.required],
      opciones: this.fb.array([]),
    });

    this.preguntas.push(preguntaForm);
  }

  eliminarPregunta(index: number): void {
    this.preguntas.removeAt(index);
  }

  getOpciones(pregunta: FormGroup): FormArray {
    return pregunta.get('opciones') as FormArray;
  }

  agregarOpcion(pregunta: FormGroup): void {
    this.getOpciones(pregunta).push(
      this.fb.group({
        numero: [this.getOpciones(pregunta).length + 1],
        texto: ['', Validators.required],
      }),
    );
  }

  eliminarOpcion(pregunta: FormGroup, index: number): void {
    this.getOpciones(pregunta).removeAt(index);
  }

  eliminarPreguntaActual(idPregunta: number): void {
    this.preguntasAEliminar.push(idPregunta);
    this.encuesta!.preguntas = this.encuesta!.preguntas.filter(p => p.id !== idPregunta);
  }

  guardarEncuesta(): void {
    if (this.encuestaForm.invalid) return;

    const formValue = this.encuestaForm.value;
    const dtoCrear: CreateEncuestaDTO = formValue;
      this.guardarEncuestaCreada.emit(dtoCrear);

  }

  volver(): void {
    this.location.back();
  }
}
