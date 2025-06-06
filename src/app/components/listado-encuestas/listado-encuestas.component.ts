import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EncuestasService } from '../../services/encuestas.service';
import { EncuestaDTO } from '../../interfaces/encuesta.dto';

@Component({
  selector: 'app-listado-encuestas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listado-encuestas.component.html',
  styleUrls: ['./listado-encuestas.component.css'],
})
export class ListadoEncuestasComponent implements OnInit {
  encuestas: EncuestaDTO[] = [];
  pagina = 1;
  readonly limite = 3;
  total = 0;

  constructor(private readonly encuestasService: EncuestasService) {}

  ngOnInit(): void {
    this.cargarEncuestas();
  }

  cargarEncuestas(): void {
    this.encuestasService.obtenerEncuestas(this.pagina, this.limite).subscribe({
      next: ({ data, total }) => {
        this.encuestas = data;
        this.total = total;
      },
      error: (err) => {
        console.error('Error al cargar encuestas:', err);
      },
    });
  }

  paginaAnterior(): void {
    if (this.pagina > 1) {
      this.pagina--;
      this.cargarEncuestas();
    }
  }

  paginaSiguiente(): void {
    const totalPaginas = Math.ceil(this.total / this.limite);
    if (this.pagina < totalPaginas) {
      this.pagina++;
      this.cargarEncuestas();
    }
  }
}
