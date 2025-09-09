// src/app/core/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl + '/accounts';

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post(this.baseUrl + '/login', model);
  }

  register(model: any) {
    return this.http.post(this.baseUrl + '/register', model);
  }

  // Метод для сохранения токена
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Метод для получения токена
  getToken() {
    return localStorage.getItem('token');
  }

  // Метод для выхода
  logout() {
    localStorage.removeItem('token');
  }
}