// src/app/features/trees/tree.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TreeService {
  private baseUrl = environment.apiUrl + '/trees';

  constructor(private http: HttpClient) { }

  // Получаем список деревьев текущего пользователя
  // Запрос будет автоматически перехвачен jwtInterceptor-ом
  getCurrentUserTrees() {
    return this.http.get(this.baseUrl);
  }
}