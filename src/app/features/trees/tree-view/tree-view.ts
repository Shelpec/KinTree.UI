import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// --- ИЗМЕНЕНИЕ 1: Импортируем Layout и DagreLayout ---
import { NgxGraphModule, Layout, DagreLayout } from '@swimlane/ngx-graph';
import { Subject } from 'rxjs';
import * as d3 from 'd3';
import { KinshipService } from '../../kinship/kinship';

export interface Node {
  id: string;
  label: string;
  data: any;
}

export interface Link {
  id?: string;
  source: string;
  target: string;
  label?: string;
}

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [CommonModule, NgxGraphModule, RouterLink],
  providers: [DatePipe],
  templateUrl: './tree-view.html',
  styleUrl: './tree-view.scss'
})
export class TreeViewComponent implements OnInit {
  treeId: string | null = null;
  isLoading = true;
  error: string | null = null;

  nodes: Node[] = [];
  links: Link[] = [];

  update$: Subject<boolean> = new Subject();
  public d3 = d3;
  // --- ИЗМЕНЕНИЕ 1: Layout - это просто строка ---
  layout: string = 'dagre';
  
  // --- ИЗМЕНЕНИЕ 2: Настройки вынесены в отдельный объект ---
  public layoutSettings = {
    orientation: 'TB', // Top-to-Bottom
    ranker: 'longest-path',
    nodePadding: 50,
    rankPadding: 150
  };
  // --- ИЗМЕНЕНИЕ 3: Переносим panning и zoomable в отдельные свойства ---
  panningEnabled: boolean = true;
  zoomEnabled: boolean = true;
  
  constructor(
    private route: ActivatedRoute,
    private kinshipService: KinshipService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
      next: (response: any[]) => {
        this.transformDataToGraph(response);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Ошибка при загрузке данных дерева.";
        this.isLoading = false;
      }
    });
  }
  
  transformDataToGraph(rootNodes: any[]) {
    const tempNodes: Node[] = [];
    const tempLinks: Link[] = [];
    const addedNodes = new Set<string>();

    const processNodeAndSpouses = (person: any) => {
        if (!person || addedNodes.has(person.id)) return;

        if (!addedNodes.has(person.id)) {
            tempNodes.push({ id: person.id, label: `${person.firstName} ${person.lastName}`, data: person });
            addedNodes.add(person.id);
        }

        if (person.spouses && person.spouses.length > 0) {
            person.spouses.forEach((spouse: any) => {
                if (addedNodes.has(spouse.id)) return;

                tempNodes.push({ id: spouse.id, label: `${spouse.firstName} ${spouse.lastName}`, data: spouse });
                addedNodes.add(spouse.id);

                const marriageNodeId = `marriage-${person.id}-${spouse.id}`;
                tempNodes.push({ id: marriageNodeId, label: 'marriage', data: { isMarriageNode: true } });
                
                tempLinks.push({ source: person.id, target: marriageNodeId });
                tempLinks.push({ source: spouse.id, target: marriageNodeId });

                if (person.children && person.children.length > 0) {
                    person.children.forEach((child: any) => {
                        tempLinks.push({ source: marriageNodeId, target: child.id });
                        processNodeAndSpouses(child);
                    });
                }
            });
        } else if (person.children && person.children.length > 0) {
            person.children.forEach((child: any) => {
                tempLinks.push({ source: person.id, target: child.id });
                processNodeAndSpouses(child);
            });
        }
    };

    rootNodes.forEach(root => processNodeAndSpouses(root));

    this.nodes = tempNodes;
    this.links = tempLinks;
    this.update$.next(true);
  }

  goBack() {
    this.router.navigate(['/trees']);
  }
}