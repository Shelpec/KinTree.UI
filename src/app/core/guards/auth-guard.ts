// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getToken()) {
    // Если токен есть, пользователь может пройти
    return true;
  } else {
    // Если токена нет, перенаправляем на страницу входа
    router.navigate(['/login']);
    return false;
  }
};