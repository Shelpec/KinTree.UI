import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KinshipRelation, KinshipService } from '../../kinship/kinship';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './person-detail.html',
  styleUrl: './person-detail.scss'
})
export class PersonDetailComponent implements OnInit {
  personId: string | null = null;
  kinshipData: KinshipRelation[] = [];
  personInFocus: KinshipRelation | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private kinshipService: KinshipService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.personId = this.route.snapshot.paramMap.get('id');
    if (this.personId) {
      this.loadKinshipData();
    } else {
      this.error = "ID человека не найден.";
      this.isLoading = false;
    }
  }

  loadKinshipData() {
    if (!this.personId) return;
    this.isLoading = true;
    this.error = null;

    this.kinshipService.getKinshipForPerson(this.personId).subscribe({
      next: (response) => {
        // Сортируем по дате рождения, чтобы старшие были вверху
        const sortedData = response.sort((a, b) => {
          const dateA = a.person.dateOfBirth ? new Date(a.person.dateOfBirth).getTime() : 0;
          const dateB = b.person.dateOfBirth ? new Date(b.person.dateOfBirth).getTime() : 0;
          return dateA - dateB;
        });

        this.kinshipData = sortedData;
        this.personInFocus = sortedData.find(p => p.termDisplayName === 'Өзі') || null;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Ошибка при загрузке данных о родственниках.";
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  goBackToTree() {
    // Нам нужен ID дерева, чтобы вернуться. Пока заглушка.
    // TODO: Передавать treeId в этот компонент.
    this.router.navigate(['/trees']);
  }
}