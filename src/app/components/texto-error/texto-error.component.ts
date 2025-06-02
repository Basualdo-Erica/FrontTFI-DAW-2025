import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { NgIf } from '@angular/common'; 

@Component({
  selector: 'app-texto-error',
  standalone: true,                  
  imports: [NgIf],                 
  templateUrl: './texto-error.component.html',
})
export class TextoErrorComponent {
  @Input() control!: AbstractControl | null;
}
