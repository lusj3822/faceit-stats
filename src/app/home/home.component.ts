import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <h1>Faceit Statistics</h1>
      <p class="text-white">Enter your Faceit username to get your statistics</p>
      <div class="search-box">
        <input
          type="text"
          placeholder="Eg. s1mple"
          class="search-input" 
          [ngClass]="{ 'input-error': errorMessage }"
          [(ngModel)]="username"
          (keyup.enter)="searchPlayer()"
        >
      </div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  `,
  styles: [
    `.container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(to bottom, #101010, #1a1a1a);
      color: white;
      margin: 0;
      padding: 0;
      width: 100vw;
      position: fixed;
      top: 0;
      left: 0;
    }
    .search-box {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
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
    .search-input:hover {
      outline: none;
      border-color: #f50;
    }
    .search-input:focus {
      outline: none;
      border-color: #f50;
    }
    .input-error {
      border-color: #c00 !important;
    }
    .error-message {
      margin-top: 1rem;
      color: red;
    }
  `]
})
export class HomeComponent {
  username: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  async searchPlayer() {
    this.errorMessage = '';
    console.log(environment.apiKey);
    if (this.username.trim()) {
      try {
        const response = await fetch(`https://open.faceit.com/data/v4/players?nickname=${this.username}`, {
          headers: {
            'Authorization': `Bearer ${environment.apiKey}`
          }
        });

        if (!response.ok) {
          this.errorMessage = 'User not found.';
          return;
        }

        const playerData = await response.json();
        if (!playerData || !playerData.player_id) {
          this.errorMessage = 'User not found.';
          return;
        }

        await this.router.navigate(['/stats'], {
          queryParams: { username: this.username }
        });
      } catch (error) {
        this.errorMessage = 'User not found.';
      }
    }
  }
}