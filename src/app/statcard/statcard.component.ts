import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatSubItem {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-statcard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="content">
        <p class="heading">{{ title }}</p>
        <div class="main-stat-row">
          <span class="main-stat">{{ value }}</span>
        </div>
        <div class="sub-stats">
          <div class="sub-stat-row" *ngFor="let item of subStats">
            <span class="sub-label">{{ item.label }}</span>
            <span class="sub-value">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './statcard.component.css'
})
export class StatcardComponent {
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() subStats: StatSubItem[] = [];
}
