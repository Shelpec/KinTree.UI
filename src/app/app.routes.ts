import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { TreeListComponent } from './features/trees/tree-list/tree-list';
import { authGuard } from './core/guards/auth-guard';
import { TreeViewComponent } from './features/trees/tree-view/tree-view';
import { PersonDetailComponent } from './features/people/person-detail/person-detail';
// Проверяем пути к компонентам

export const routes: Routes = [
  // Публичные роуты
  { path: 'login', component: LoginComponent },
  //{ path: 'register', component: RegisterComponent },

  // Защищенные роуты
  {
    path: 'trees',
    component: TreeListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'trees/view/:id',
    component: TreeViewComponent,
    canActivate: [authGuard]
  },
  // Вот наш новый роут. Убедимся, что он здесь есть.
  {
    path: 'person/:id',
    component: PersonDetailComponent,
    canActivate: [authGuard]
  },

  // Редиректы
  { path: '', redirectTo: '/trees', pathMatch: 'full' },
  { path: '**', redirectTo: '/trees' }
];