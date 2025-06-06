import { Routes } from '@angular/router';
import { CrearEncuestaComponent } from './components/crear-encuesta/crear-encuesta.component';

export const routes: Routes = [
  {
    path: '',
    component: CrearEncuestaComponent,
  },

  {
    path: 'encuesta/:id/:codigo/resultados',
    loadComponent: () =>
      import('./components/encuesta-gestion/encuesta-gestion.component').then(
        (m) => m.EncuestaGestionComponent,
      ),
  },

  {
    path: 'encuesta',
    component: CrearEncuestaComponent,
  },

  {
    path: 'respuestas/:id/paginadas',
    loadComponent: () =>
      import(
        './components/listado-respuestas/listado-respuestas.component'
      ).then((m) => m.ListadoRespuestasComponent),
  },

  {
    path: 'respuesta/:id',
    loadComponent: () =>
      import('./components/encuesta-respuesta/encuesta-respuesta.component').then(
        (m) => m.EncuestaRespuestaComponent,
      ),
  },

  {
    path: '**',
    redirectTo: '',
  },
];
