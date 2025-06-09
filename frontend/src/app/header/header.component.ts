import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private router = inject(Router);

  irAlInicio() {
    this.router.navigate(['/']); 
  }

  irACrearEncuesta() {
    this.router.navigate(['/crear-encuesta']); 
  }

   irAVerRespuesta() {
    this.router.navigate(['/']) //hay que completar esto, ahora solo te lleva al inico
   }
}
