import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>Faceit Stats</h1>
        <div class="search-box">
          <input
            type="text" 
            placeholder="Enter Faceit username..." 
            class="search-input"
            [(ngModel)]="username"
            (keyup.enter)="searchPlayer()"
          >
        </div>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #1a1a1a;
      color: white;
      margin: 0;
      padding: 0;
      width: 100vw;
      position: fixed;
      top: 0;
      left: 0;
    }

    .search-container {
      display: flex;
      justify-content: center;
      text-align: center;
      padding: 2rem;
      background-color: #2a2a2a;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
      height: 50px;
    }

    h1 {
      margin-bottom: 1rem;
      font-size: 2.5rem;
      color: white;
    }

    .search-box {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .material-symbols-outlined {
      display: flex;
      align-items: center;
    }

    .search-input {
      width: 20vw;
      height: 5vh;
      flex: 1;
      padding: 0.75rem 1rem;
      border: 2px solid #3a3a3a;
      border-radius: 0.5rem;
      background-color: #1a1a1a;
      color: white;
      font-size: 1.5rem;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #f50;
    }
  `]
})
export class HomeComponent {
  username: string = '';

  constructor(private router: Router) {}

  async searchPlayer() {
    if (this.username.trim()) {
      try {
        await this.router.navigate(['/stats'], {
          queryParams: { username: this.username }
        });
      } catch (error) {
        console.error('Error searching player:', error);
      }
    }
  }
} 