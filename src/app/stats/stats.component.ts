import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StatcardComponent } from '../statcard/statcard.component';
import { apiKey } from '../../environment';
import { BaseChartDirective } from 'ng2-charts';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, StatcardComponent, BaseChartDirective, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="player-info-card">
      <div class="avatar-container">
          <img [src]="avatar" alt="Avatar" class="avatar-image" />
      </div>
      <div class="username">{{ username }}</div>
      <div class="player-details">
        <p>Elo: {{ elo }}</p>
        <p>Level: {{ level }}</p>
        <p>Country: {{ countryFullName }}</p>
      </div>
    </div>
    <h1 class="stats-title">{{ hasGameData ? 'Statistics for last 20 games' : 'No match data found (inactive player)' }}</h1>
    <div class="stats-container">
      <div class="stats-grid">
        <app-statcard 
          title="K/D Ratio" 
          [value]="kd"
          [subStats]="kdSubStats">
        </app-statcard>

        <app-statcard 
          title="Average Damage Per Round" 
          [value]="averageADR">
        </app-statcard>

        <app-statcard 
          title="Headshot %" 
          [value]="headshotPercentage" 
          [subStats]="headshotSubStats">
        </app-statcard>

        <app-statcard 
          title="Win Rate" 
          [value]="winRate" 
          [subStats]="winrateSubStats">
        </app-statcard>
      </div>
    </div>

    <div class="kd-chart-container" *ngIf="isBrowser">
      <h2>K/D Ratio (Last 20 Games)</h2>
      <canvas baseChart
        [datasets]="kdChartData"
        [labels]="kdChartLabels"
        [options]="kdChartOptions"
        [type]="'line'">
      </canvas>
    </div>
  `,
  styles: [
    `.player-info-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 5rem auto 0 auto;
    }
    .faceit-level {
      width: 30px;
      height: 30px;
    }
    .flag {
      width: 30px;
      height: 30px;
    }
    .avatar-image {
      width: 96px;
      height: 96px;
      border-radius: 10px;
      border: 4px solid #212121;
      box-shadow: 0 2px 12px rgba(0,0,0,0.25);
      background: #212121;
      object-fit: cover;
    }
    .player-details {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 0px 32px 24px 32px;
      color: #fff;
      font-size: 1.2rem;
      gap: 1rem;
    }
    .username {
      color: #fff;
      font-size: 2rem;
      font-weight: 700;
    }
    .stats-title {
      color: #f50;
      font-size: 1.5rem;
      font-weight: 700;
      margin-left: 2rem;
      text-align: center;
    }
    .stats-container {
      padding: 2rem;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      max-width: 1100px;
      margin: 0 auto;
      justify-items: center;
      width: 100%;
    }
    .kd-chart-container {
      margin-top: 2rem;
      background: #232323;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 12px rgba(0,0,0,0.15);
      color: #fff;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 2rem;
    }
    .kd-chart-container:hover {
      box-shadow: 0 0 20px rgba(255, 85, 0, 0.8);
      border-color: #f50;
    }
    .kd-chart-container h2 {
      margin-bottom: 1rem;
      font-size: 1.3rem;
      font-weight: 600;
      color: #f50;
    }
  `]
})
export class StatsComponent implements OnInit {
  username: string = '';
  avatar: string = '';
  level: number = 0;
  elo: number = 0;
  country: string = '';

  kd: string = '0.00';

  kdSubStats = [
    { label: 'Avg. Kills:', value: '0.00' },
    { label: 'Avg. Deaths:', value: '0.00' },
    { label: 'Avg. Assists:', value: '0.00' }
  ];
  winrateSubStats = [
    { label: 'Wins:', value: '0.00' },
    { label: 'Losses:', value: '0.00' },
  ];

  headshotSubStats = [
    { label: 'Headshots:', value: '0.00' },
    { label: 'Total Kills:', value: '0.00' },
  ];

  averageADR: string = '0.00';
  headshotPercentage: string = '0.00%';
  winRate: string = '0.00%';

  public kdChartData = [
    { data: [], label: 'K/D Ratio', fill: false, borderColor: '#f50', tension: 0.3 }
  ];
  public kdChartLabels: string[] = [];
  public kdChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { title: { display: true, text: 'Game' } },
      y: { title: { display: true, text: 'K/D Ratio' }, beginAtZero: true }
    }
  };

  isBrowser = false;

  countryNames: { [key: string]: string } = {
    se: 'Sweden',
    dk: 'Denmark',
    no: 'Norway',
    fi: 'Finland',
    de: 'Germany',
    fr: 'France',
    es: 'Spain',
    it: 'Italy',
    pl: 'Poland',
    nl: 'Netherlands',
    be: 'Belgium',
    ru: 'Russia',
    ua: 'Ukraine',
    cz: 'Czech Republic',
    sk: 'Slovakia',
    pt: 'Portugal',
    ch: 'Switzerland',
    at: 'Austria'
  };

  hasGameData: boolean = true;

  get countryFullName(): string {
    const code = (this.country || '').toLowerCase();
    return this.countryNames[code] || this.country || '';
  }

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      if (this.username) {
        this.getPlayerData(this.username);
        this.getPlayerStats(this.username);
      }
    });
  }

  private async getPlayerData(username: string) {

    try {
      const playerResponse = await fetch(`https://open.faceit.com/data/v4/players?nickname=${username}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!playerResponse.ok) {
        throw new Error(`Failed to fetch player data: ${playerResponse.status}`);
      }
      const playerData = await playerResponse.json();

      const defaultAvatar = 'defaultavatar.jpg';
      this.avatar = playerData.avatar || defaultAvatar;

      if (!playerData.games.cs2) return;

      this.level = playerData.games.cs2.skill_level;
      this.elo = playerData.games.cs2.faceit_elo;
      this.country = playerData.country;
    } catch (error) {
      console.error('Error fetching player data:', error);
    }
  }

  private async getPlayerStats(username: string) {

    try {
      const playerResponse = await fetch(`https://open.faceit.com/data/v4/players?nickname=${username}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!playerResponse.ok) {
        throw new Error(`Failed to fetch player data: ${playerResponse.status}`);
      }

      const playerData = await playerResponse.json();
      const playerId = playerData.player_id;

      const matchResponse = await fetch(`https://open.faceit.com/data/v4/players/${playerId}/games/cs2/stats`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!matchResponse.ok) {
        throw new Error(`Failed to fetch match history: ${matchResponse.status}`);
      }

      const json = await matchResponse.json();
      const matchData = json.items;

      if (!matchData || matchData.length === 0) {
        this.hasGameData = false;
        return;
      }
      this.hasGameData = true;

      let totalKills = 0;
      let totalDeaths = 0;
      let totalAssists = 0;
      let totalHeadshots = 0;
      let totalADR = 0;
      let totalRounds = 0;
      let totalWins = 0;
      let totalLosses = 0;

      matchData.forEach((match: any) => {
        totalKills += Number(match.stats.Kills);
        totalDeaths += Number(match.stats.Deaths);
        totalAssists += Number(match.stats.Assists);
        totalHeadshots += Number(match.stats.Headshots);
        totalADR += Number(match.stats.ADR);
        totalRounds += Number(match.stats.Rounds);
        if(match.stats.Result === "1"){
          totalWins += 1;
        }
        else if(match.stats.Result === "0"){
          totalLosses += 1;
        }
      });

      this.kd = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : '0.00';

      this.kdSubStats = [
        { label: 'Avg. Kills:', value: (totalKills / matchData.length).toFixed(2) },
        { label: 'Avg. Deaths:', value: (totalDeaths / matchData.length).toFixed(2) },
        { label: 'Avg. Assists:', value: (totalAssists / matchData.length).toFixed(2) }
      ];

      this.averageADR = matchData.length > 0 ? (totalADR / matchData.length).toFixed(2) : '0.00';
      this.headshotPercentage = totalKills > 0 ? ((totalHeadshots / totalKills) * 100).toFixed(2) + '%' : '0.00%';
      this.winRate = (totalWins + totalLosses) > 0 ? ((totalWins / (totalWins + totalLosses)) * 100).toFixed(2) + '%' : '0.00%';

      this.winrateSubStats = [
        { label: 'Wins:', value: totalWins.toString() },
        { label: 'Losses:', value: totalLosses.toString() }
      ];

      this.headshotSubStats = [
        { label: 'Headshots:', value: totalHeadshots.toString() },
        { label: 'Total Kills:', value: totalKills.toString() }
      ];

      const last20 = matchData.slice(0, 20).reverse();
      this.kdChartData[0].data = last20.map((match: any) => {
        const kills = Number(match.stats.Kills);
        const deaths = Number(match.stats.Deaths);
        return deaths > 0 ? (kills / deaths) : 0;
      });
      this.kdChartLabels = last20.map((match: any, idx: number) => {
        const createdAt = match.stats["Created At"];
        if (createdAt) {
          const date = new Date(createdAt);
          return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
        }
        return `Game ${idx + 1}`;
      });

    } catch (error) {
      console.error('Error fetching player stats:', error);
    }
  }
} 