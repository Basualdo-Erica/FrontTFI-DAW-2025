import { Routes } from '@angular/router';
import { ComienzoComponent } from './components/comienzo/comienzo.component';

export const routes: Routes = [
  { path: '', component: ComienzoComponent },
  {
    path: 'crear-encuesta',
    loadComponent: () =>
      import('./components/creacion-encuesta/creacion-encuesta.component').then(m => m.CreacionEncuestaComponent),
  },
];
