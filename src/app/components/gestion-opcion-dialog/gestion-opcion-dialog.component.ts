import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-opcion-dialog',
  templateUrl: './gestion-opcion-dialog.component.html',
  styleUrls: ['./gestion-opcion-dialog.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class GestionOpcionDialogComponent {
  dialogVisible = signal(false);

  @Output() opcionCreada = new EventEmitter<any>();
  @Output() cerrado = new EventEmitter<void>();

  abrirDialog() {
    this.dialogVisible.set(true);
  }

  cerrarDialog() {
    this.dialogVisible.set(false);
    this.cerrado.emit();
  }

  guardarOpcion() {
    this.opcionCreada.emit({
      texto: 'Opción ejemplo',
      esCorrecta: true,
    });
    this.cerrarDialog();
  }
}
