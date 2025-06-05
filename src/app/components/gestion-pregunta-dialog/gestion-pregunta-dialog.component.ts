import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast'; 
import { MessageService } from 'primeng/api';

interface Opcion {
  texto: string;
  numero?: number; 
}

@Component({
  selector: 'app-gestion-pregunta-dialog',
  templateUrl: './gestion-pregunta-dialog.component.html',
  styleUrls: ['./gestion-pregunta-dialog.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  providers: [MessageService],
})
export class GestionPreguntaDialogComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() preguntaParaEditar: any = null; 

  @Output() preguntaCreada = new EventEmitter<any>();

  textoPregunta: string = '';
  tipoPregunta: string = 'LIBRE';
  opciones: Opcion[] = [];
  numeroPregunta: number | null = null; 

  constructor(private messageService: MessageService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['preguntaParaEditar'] && this.preguntaParaEditar) {
      this.cargarPreguntaParaEdicion(this.preguntaParaEditar);
    }
    
    if (changes['visible'] && !this.visible) {
      this.resetForm();
    }
  }

  cargarPreguntaParaEdicion(pregunta: any) {
    this.textoPregunta = pregunta.texto || '';
    this.tipoPregunta = pregunta.tipo || 'LIBRE';
    this.opciones = pregunta.opciones ? [...pregunta.opciones] : [];
    this.numeroPregunta = pregunta.numero ?? null; 
  }

  cerrarDialog() {
    this.visibleChange.emit(false);
    this.resetForm();
  }

  resetForm() {
    this.textoPregunta = '';
    this.tipoPregunta = 'LIBRE';
    this.opciones = [];
    this.numeroPregunta = null;
  }

  agregarOpcion() {
    this.opciones.push({ texto: '' });
  }

  eliminarOpcion(index: number) {
    this.opciones.splice(index, 1);
  }

  guardarPregunta() {
    if (!this.textoPregunta.trim()) {
      this.showError('Por favor escribí el texto de la pregunta.');
      return;
    }

    if ((this.tipoPregunta === 'OPCION_SIMPLE' || this.tipoPregunta === 'OPCION_MULTIPLE') && this.opciones.length === 0) {
      this.showError('Agregá al menos una opción.');
      return;
    }

    if ((this.tipoPregunta === 'OPCION_SIMPLE' || this.tipoPregunta === 'OPCION_MULTIPLE')) {
      for (let opcion of this.opciones) {
        if (!opcion.texto.trim()) {
          this.showError('Las opciones no pueden estar vacías. Por favor, completá todas las opciones.');
          return;
        }
      }
    }

    if ((this.tipoPregunta === 'OPCION_SIMPLE' || this.tipoPregunta === 'OPCION_MULTIPLE') && this.opciones.length < 2) {
      this.showError('Por favor agregá al menos dos opciones.');
      return;
    }

    this.preguntaCreada.emit({
      texto: this.textoPregunta,
      tipo: this.tipoPregunta,
      opciones: this.opciones,
      numero: this.numeroPregunta 
    });

    this.cerrarDialog();
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
