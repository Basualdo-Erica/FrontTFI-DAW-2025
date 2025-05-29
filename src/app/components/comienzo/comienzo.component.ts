import { Component } from '@angular/core';

@Component({
  selector: 'app-comienzo',
  templateUrl: './comienzo.component.html',
  styleUrls: ['./comienzo.component.css']
})
export class ComienzoComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
