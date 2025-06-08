import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <button class="navbar-title" (click)="goHome()">Faceit Stats</button>
    </nav>
  `,
  styles: [`
    .navbar {
      width: 100vw;
      padding: 1rem 0;
      display: flex;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
    }
    .navbar-title {
      background: none;
      border: none;
      color: #fff;
      font-size: 1.5rem;
      font-weight: bold;
      margin-left: 2rem;
      cursor: pointer;
      transition: color 0.2s;
    }
    .navbar-title:hover {
      color: #fff;
    }
  `]
})
export class NavbarComponent {
  constructor(private router: Router) {}
  goHome() {
    this.router.navigate(['/']);
  }
} 