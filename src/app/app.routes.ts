import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Board } from './pages/board/board';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'board', component: Board },
  { path: '**', redirectTo: 'login' }
];
