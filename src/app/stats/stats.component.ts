import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StatcardComponent } from '../statcard/statcard.component';
import { apiKey } from '../../environment';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, StatcardComponent],
  template: `
    <div class="player-info-card">
      <div class="cover-container">
        <img [src]="coverImage" alt="Cover Image" class="cover-image" />
        <div class="avatar-container">
          <img [src]="avatar" alt="Avatar" class="avatar-image" />
        </div>
      </div>
      <div class="player-details">
        <div class="username">{{ username }}</div>
        <div class="info-pills">
          <span class="pill">Elo: <span class="pill-value">{{ elo }}</span></span>
          <span class="pill">Level: <span class="pill-value">{{ level }}</span></span>
          <span class="pill">Region: <span class="pill-value">{{ region }}</span></span>
          <span class="pill">Country: <span class="pill-value">{{ country }}</span></span>
          <span class="pill">SteamID: <span class="pill-value">{{ steamID }}</span></span>
        </div>
      </div>
    </div>

    <div class="stats-container">
      <h1>Player Stats</h1>
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
  `,
  styles: [`
    .player-info-card {
      max-width: 700px;
      margin: 2rem auto 3.5rem auto;
      background: #212121;
      border-radius: 18px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.25);
      overflow: hidden;
      position: relative;
    }
    .cover-container {
      position: relative;
      width: 100%;
      height: 160px;
      background: #232b3a;
    }
    .cover-image {
      width: 100%;
      height: 160px;
      object-fit: cover;
      display: block;
    }
    .avatar-container {
      position: absolute;
      left: 32px;
      bottom: -48px;
      z-index: 2;
    }
    .avatar-image {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      border: 4px solid #f50;
      box-shadow: 0 2px 12px rgba(0,0,0,0.25);
      background: #212121;
      object-fit: cover;
    }
    .player-details {
      padding: 56px 32px 24px 32px;
      color: #fff;
    }
    .username {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
    .info-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .pill {
      background: #303030;
      color: #e8e8e8;
      border-radius: 999px;
      padding: 0.4rem 1.1rem;
      font-size: 1rem;
      font-weight: 500;
      display: inline-block;
    }
    .pill-value {
      color: #f50;
      font-weight: 700;
    }
    .stats-container {
      padding: 2rem;
      color: white;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      margin-top: 2rem;
    }
  `]
})
export class StatsComponent implements OnInit {
  username: string = '';
  avatar: string = '';
  coverImage: string = '';
  level: number = 0;
  elo: number = 0;
  region: string = '';
  country: string = '';
  steamID: string = '';

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
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

      const defaultCover = 'https://cdn.statically.io/img/codetheweb.blog/assets/img/posts/css-advanced-background-images/cover.jpg?f=webp&w=720';
      this.avatar = playerData.avatar || defaultCover;
      this.coverImage = playerData.cover_image || defaultCover;
      this.level = playerData.games.cs2.skill_level;
      this.elo = playerData.games.cs2.faceit_elo;
      this.region = playerData.games.cs2.region;
      this.country = playerData.country;
      this.steamID = playerData.games.cs2.game_player_id;
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
        console.log('No match data available');
        return;
      }

      let totalKills = 0;
      let totalDeaths = 0;
      let totalAssists = 0;
      let totalHeadshots = 0;
      let totalADR = 0;
      let totalRounds = 0;
      let totalWins = 0;
      let totalLosses = 0;

      console.log(matchData);

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

      console.log('Stats updated:', {
        kd: this.kd,
        kdSubStats: this.kdSubStats,
        averageADR: this.averageADR,
        headshotPercentage: this.headshotPercentage,
        winRate: this.winRate
      });

    } catch (error) {
      console.error('Error fetching player stats:', error);
    }
  }
} 