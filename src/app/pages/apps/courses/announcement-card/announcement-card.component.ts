import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Ajoute cette ligne

@Component({
  selector: 'app-announcement-card',
  templateUrl: './announcement-card.component.html',
  standalone: true, // Si tu utilises des composants standalone
  imports: [CommonModule], // Ajoute CommonModule ici
  styleUrls: ['./announcement-card.component.scss'],
})
export class AnnouncementCardComponent {
  @Input() announcement: any; // L'annonce à afficher
}