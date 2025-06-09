import { Routes } from '@angular/router';
import { ComienzoComponent } from './components/comienzo/comienzo.component';
export const routes: Routes = [
  { path: '', component: ComienzoComponent },
  {
    path: 'crear-encuesta',
    loadComponent: () =>
      import('./components/creacion-encuesta/creacion-encuesta.component').then(m => m.CreacionEncuestaComponent),
  },
  {
    path: 'enlaces',
    loadComponent: () =>
      import('./components/enlaces/enlaces.component').then(m => m.EnlacesComponent),
  },
];

