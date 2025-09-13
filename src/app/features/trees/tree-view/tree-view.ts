// src/app/features/trees/tree-view/tree-view.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PersonNodeComponent } from '../person-node/person-node';
import { KinshipService } from '../../kinship/kinship';

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [CommonModule, PersonNodeComponent],
  templateUrl: './tree-view.html',
  styleUrl: './tree-view.scss'
})
export class TreeViewComponent implements OnInit {
  treeId: string | null = null;
  treeData: any = null; // Здесь будет храниться вся иерархия
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private kinshipService: KinshipService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Получаем ID дерева из URL (например, /trees/view/0199241d...)
    this.treeId = this.route.snapshot.paramMap.get('id');
    if (this.treeId) {
      this.loadTreeData();
    } else {
      this.error = "ID дерева не найден.";
      this.isLoading = false;
    }
  }

  loadTreeData() {
    if (!this.treeId) return;
    this.isLoading = true;
    this.error = null;

    this.kinshipService.getFullTree(this.treeId).subscribe({
      next: (response: any) => {
        this.treeData = response; // <-- Просто присваиваем ответ
        this.isLoading = false;
        console.log('Данные дерева загружены:', this.treeData);
      },
      error: (err) => {
        this.error = "Ошибка при загрузке данных дерева.";
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/trees']);
  }
}