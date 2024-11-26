import { Component } from '@angular/core';
import { GameService } from './services/game.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameDataParamsService } from './params/game-data-params.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export default class GameComponent {
  gameCode: string = '';
  errorMessage: string | null = null;
  showAlert: boolean = false;
  mode: string | null = null; 

  constructor(private gameService: GameService, private router: Router, private route: ActivatedRoute, private gameDataParamsService: GameDataParamsService) {
    this.route.queryParams.subscribe((params) => {
      this.mode = params['mode']; // Puede ser 'find' o 'practice'
      console.log(`Game mode: ${this.mode}`);
    });
  }

  submitCode() {
    console.log('submitCode');
    if (this.gameCode.trim()) {
      this.gameService.submitGameCode(this.gameCode).subscribe({
        next: (response) => {
          const gameData = response.questions;
          this.gameDataParamsService.setGameDataLocalStorage(gameData);
          this.gameDataParamsService.setGameData(gameData);
          if (this.mode === 'find') {
            this.router.navigate(['/quiz-game']); 
          } else if (this.mode === 'practice') {
            this.router.navigate(['/practice-game']); 
          }
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.showAlert = true;
          setTimeout(() => {
            this.closeAlert();
          }, 3000);
        },
      });
    } else {
      this.errorMessage = 'Por favor, ingresa un código válido';
      this.showAlert = true;
      setTimeout(() => {
        this.closeAlert();
      }, 3000);
    }
  }

  closeAlert(): void {
    this.showAlert = false;
  }
}
