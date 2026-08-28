import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page')
  },
  {
    path: 'routine/:day',
    loadComponent: () => import('./pages/routine/routine.page')
  },
  {
    path: 'setup',
    loadComponent: () => import('./pages/setup/setup.page')
  },
  {
    path: 'setup/:day',
    loadComponent: () => import('./pages/setup-day/setup-day.page')
  }
];
