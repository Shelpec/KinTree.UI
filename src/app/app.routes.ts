// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { TreeListComponent } from './features/trees/tree-list/tree-list';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // Публичные роуты
  { path: 'login', component: LoginComponent },
  //{ path: 'register', component: RegisterComponent },

  // Защищенные роуты
  {
    path: 'trees',
    component: TreeListComponent,
    canActivate: [authGuard] // <-- Защищаем этот роут
  },

  // Редиректы
  { path: '', redirectTo: '/trees', pathMatch: 'full' }, // Теперь по умолчанию идем на /trees
  { path: '**', redirectTo: '/trees' } // Если страница не найдена, тоже на /trees
];