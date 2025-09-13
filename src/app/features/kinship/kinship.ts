// src/app/features/kinship/kinship.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

// Описываем интерфейс для одного родственника
export interface KinshipRelation {
  person: {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    gender: string;
    dateOfBirth?: string;
  };
  termDisplayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class KinshipService {
  // Обратите внимание: базовый URL отличается!
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Получаем список родственников для конкретного человека в дереве
  // ПРИМЕЧАНИЕ: Нам нужен ID дерева для /api/tree-view, а не ID человека для /api/kinship
  // Давайте пока сделаем сервис для /api/tree-view, так как он более правильный для визуализации
  getFullTree(treeId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/tree-view/${treeId}/full`);
  }

    // --- НОВЫЙ МЕТОД ---
  // Получаем список родственников с точки зрения одного человека
  getKinshipForPerson(personId: string): Observable<KinshipRelation[]> {
    return this.http.get<KinshipRelation[]>(`${this.baseUrl}/kinship/${personId}`);
  }

  
}