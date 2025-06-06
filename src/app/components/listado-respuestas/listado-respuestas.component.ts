import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RespuestasService } from '../../services/respuestas.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';

interface Respuesta {
  pregunta: { id: number; texto: string };
  respuesta: string;
}

interface FormularioRespuesta {
  formularioId: number;
  respuestas: Respuesta[];
}

@Component({
  selector: 'app-listado-respuestas',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    CardModule,
    DividerModule,
    InputNumberModule,
  ],
  templateUrl: './listado-respuestas.component.html',
  styleUrls: ['./listado-respuestas.component.css'],
})
export class ListadoRespuestasComponent implements OnInit {
  encuestaId!: number;
  codigoResultados!: string;

  respuestas: FormularioRespuesta[] = [];
  activeIndex: number | number[] | null = null;

  pagina = 1;
  limite = 10;
  total = 0;

  constructor(
    private route: ActivatedRoute,
    private respuestasService: RespuestasService,
  ) {}

  ngOnInit(): void {
    this.obtenerParametros();
  }

  private obtenerParametros(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) this.encuestaId = +id;
    });

    this.route.queryParamMap.subscribe((query) => {
      const codigo = query.get('codigo');
      if (codigo) {
        this.codigoResultados = codigo;
        this.cargarRespuestas();
      }
    });
  }

  cargarRespuestas(): void {
    this.respuestasService
      .obtenerRespuestasPaginadasPorEncuesta(
        this.encuestaId,
        this.codigoResultados,
        this.pagina,
        this.limite,
      )
      .subscribe({
        next: ({ data, total }) => {
          this.respuestas = data || [];
          this.total = total || 0;
        },
        error: (err) => {
          console.error('Error al cargar respuestas:', err);
        },
      });
  }

  getParticipante(index: number): number {
    return (this.pagina - 1) * this.limite + index + 1;
  }

  siguiente(): void {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.activeIndex = null;
      this.cargarRespuestas();
    }
  }

  anterior(): void {
    if (this.pagina > 1) {
      this.pagina--;
      this.activeIndex = null;
      this.cargarRespuestas();
    }
  }

  cambiarLimite(): void {
    this.pagina = 1;
    this.cargarRespuestas();
  }

  get totalPaginas(): number {
    return Math.ceil(this.total / this.limite);
  }
}
