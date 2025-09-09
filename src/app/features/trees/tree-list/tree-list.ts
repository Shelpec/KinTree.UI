// src/app/features/trees/tree-list/tree-list.component.ts
import { CommonModule } from '@angular/common'; // <-- Импортируем для *ngFor
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TreeService } from '../tree';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-tree-list',
  standalone: true,
  imports: [CommonModule], // <-- Добавляем в imports
  templateUrl: './tree-list.html',
  styleUrl: './tree-list.scss'
})
export class TreeListComponent implements OnInit {
  trees: any[] = [];

  constructor(
    private treeService: TreeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTrees();
  }

  loadTrees() {
    this.treeService.getCurrentUserTrees().subscribe({
      next: (response: any) => {
        this.trees = response;
      },
      error: (error) => {
        console.error('Ошибка при загрузке деревьев', error);
        // Если ошибка авторизации (401), выкидываем на логин
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}