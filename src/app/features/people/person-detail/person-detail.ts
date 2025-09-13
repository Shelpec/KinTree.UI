import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { KinshipRelation, KinshipService } from '../../kinship/kinship';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './person-detail.html',
  styleUrl: './person-detail.scss'
})
export class PersonDetailComponent implements OnInit {
  personId: string | null = null;
  treeId: string | null = null; // <-- Добавили для кнопки "Назад"

  kinshipData: KinshipRelation[] = [];
  personInFocus: KinshipRelation | null = null;
  
  // Группы родственников для красивого вывода
  directFamily: KinshipRelation[] = [];
  ancestors: KinshipRelation[] = [];
  descendants: KinshipRelation[] = [];
  otherRelatives: KinshipRelation[] = [];

  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private kinshipService: KinshipService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Получаем оба параметра из URL
    this.personId = this.route.snapshot.paramMap.get('id');
    this.treeId = this.route.snapshot.paramMap.get('treeId'); 

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
        this.personInFocus = response.find(p => p.termDisplayName === 'Өзі') || null;
        this.groupRelatives(response); // Группируем родственников
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Ошибка при загрузке данных о родственниках.";
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  groupRelatives(data: KinshipRelation[]) {
    const directTerms = ['Әке', 'Шеше', 'Күйеуі', 'Әйелі', 'Аға', 'Іні', 'Апа', 'Қарындас', 'Сіңлі', 'Ұлы', 'Қызы'];
    const ancestorTerms = ['Ата', 'Әже', 'Баба', 'Нағашы ата', 'Нағашы әже'];
    const descendantTerms = ['Немере', 'Шөбере'];
    
    // Фильтруем и сортируем каждую группу
    this.directFamily = data.filter(r => directTerms.includes(r.termDisplayName)).sort(this.sortByBirthDate);
    this.ancestors = data.filter(r => ancestorTerms.includes(r.termDisplayName)).sort(this.sortByBirthDate);
    this.descendants = data.filter(r => descendantTerms.includes(r.termDisplayName)).sort(this.sortByBirthDate);
    
    // Все остальные
    const knownTerms = [...directTerms, ...ancestorTerms, ...descendantTerms, 'Өзі'];
    this.otherRelatives = data.filter(r => !knownTerms.includes(r.termDisplayName)).sort(this.sortByBirthDate);
  }

  private sortByBirthDate(a: KinshipRelation, b: KinshipRelation): number {
    const dateA = a.person.dateOfBirth ? new Date(a.person.dateOfBirth).getTime() : 0;
    const dateB = b.person.dateOfBirth ? new Date(b.person.dateOfBirth).getTime() : 0;
    return dateA - dateB;
  }

  goBackToTree() {
    if (this.treeId) {
      // Теперь кнопка "Назад" работает правильно
      this.router.navigate(['/trees/view', this.treeId]);
    } else {
      this.router.navigate(['/trees']);
    }
  }
}