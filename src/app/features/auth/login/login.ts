// src/app/features/auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- Импортируем для ngModel
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], // <-- Добавляем в imports
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  model: any = {};

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.model).subscribe({
      next: (response: any) => {
        console.log('Успешный вход!', response);
        this.authService.setToken(response.token);
        // ПЕРЕНАПРАВЛЯЕМ НА ГЛАВНУЮ СТРАНИЦУ
        this.router.navigate(['/trees']);
      },
      error: error => console.error('Ошибка входа', error)
    });
  }
}