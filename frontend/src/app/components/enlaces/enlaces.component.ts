import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-enlaces',
  standalone: true,
  templateUrl: './enlaces.component.html',
  styleUrls: ['./enlaces.component.css'],
  imports: [CommonModule, RouterModule] 
})
export class EnlacesComponent implements OnInit {
  participationLink: string = '';
  resultsLink: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.participationLink = params['participationLink'] || '';
      this.resultsLink = params['resultsLink'] || '';
    });
  }

  copiar(texto: string): void {
    if (!texto) return;

    navigator.clipboard.writeText(texto)
      .then(() => {
        alert('¡Enlace copiado!');
      })
      .catch(err => {
        console.error('Error al copiar:', err);
        alert('Ups, no se pudo copiar el enlace');
      });
  }

  volverInicio(): void {
    this.router.navigate(['/']);
  }
}
