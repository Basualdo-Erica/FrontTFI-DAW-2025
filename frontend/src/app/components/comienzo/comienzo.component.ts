import { Component } from '@angular/core';
import { Router } from '@angular/router';  
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comienzo',
  templateUrl: './comienzo.component.html',
  styleUrls: ['./comienzo.component.css']
})
export class ComienzoComponent {
  menuOpen = false;

  constructor(private router: Router) {}  

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  irACrearEncuesta() {
    this.router.navigate(['/crear-encuesta']); 
  }
}


