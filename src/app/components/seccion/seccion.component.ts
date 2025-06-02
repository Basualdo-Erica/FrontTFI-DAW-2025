import { Component, Input, signal, computed } from '@angular/core';
import { PreguntaDTO } from '../../interfaces/pregunta.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seccion',
  templateUrl: './seccion.component.html',
  styleUrls: ['./seccion.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class SeccionComponent {
  @Input() pregunta!: PreguntaDTO;

  // Inputs para los estilos (los valores por defecto los guardamos en signals)
  @Input() set minWidth(value: string) {
    this._minWidth.set(value);
  }
  get minWidth() {
    return this._minWidth();
  }
  private _minWidth = signal('40vw');

  @Input() set maxWidth(value: string) {
    this._maxWidth.set(value);
  }
  get maxWidth() {
    return this._maxWidth();
  }
  private _maxWidth = signal('70vw');

  @Input() set leftMargin(value: string) {
    this._leftMargin.set(value);
  }
  get leftMargin() {
    return this._leftMargin();
  }
  private _leftMargin = signal('5vw');

  @Input() set rightMargin(value: string) {
    this._rightMargin.set(value);
  }
  get rightMargin() {
    return this._rightMargin();
  }
  private _rightMargin = signal('5vw');

  // Computed para el estilo dinámico
  style = computed(() => ({
    'min-width': this.minWidth,
    'max-width': this.maxWidth,
    'margin-left': this.leftMargin,
    'margin-right': this.rightMargin,
  }));

  // Asegurarnos de que el número de pregunta siempre tenga un valor
  get numeroPregunta(): number {
    return this.pregunta.numero ?? 1; // Si no se pasa el número, se asigna 1
  }
}
