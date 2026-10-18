import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ScoreCardService } from '../scorecard-service';

@Component({
  selector: 'app-score-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './scorecard.html',
  styleUrl: './scorecard.scss',
})
export class ScoreCard {
  customerId = 0;
  isOfficer = ['loanofficer', 'loan officer'].includes(
    (localStorage.getItem('role') || '').toLowerCase()
  );
  scoreCard = signal<any>(null);
  errorMessage = signal('');

  constructor(private service: ScoreCardService, private route: ActivatedRoute) {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.isOfficer) {
      this.generateScoreCard();
    } else {
      this.getScoreCard();
    }
  }

  generateScoreCard(): void {
    this.service.generateScoreCard(this.customerId).subscribe({
      next: (res) => this.scoreCard.set(res.data),
      error: (err) => this.showError(err),
    });
  }

  getScoreCard(): void {
    this.service.getScoreCard().subscribe({
      next: (res) => this.scoreCard.set(res.data),
      error: (err) => this.showError(err),
    });
  }

  private showError(err: any): void {
    if (err.status === 404 && typeof err.error === 'string') {
      this.errorMessage.set(err.error);
    } else {
      this.errorMessage.set('Something went wrong. Is the API running?');
    }
  }
}
