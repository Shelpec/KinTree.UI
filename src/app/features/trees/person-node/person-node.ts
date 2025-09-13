import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // <-- Импортируем

@Component({
  selector: 'app-person-node',
  standalone: true,
  imports: [CommonModule, RouterLink], // CommonModule нужен для *ngIf, *ngFor
  templateUrl: './person-node.html',
  styleUrl: './person-node.scss'
})
export class PersonNodeComponent {
  // @Input() означает, что `node` будет передан этому компоненту извне
  @Input() node: any;

  @Input() treeId: string | null | undefined; 
  
}