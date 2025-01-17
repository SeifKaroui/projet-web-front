import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Ce service est disponible dans toute l'application
})
export class ColorService {
  constructor() {}

  // Fonction pour générer un dégradé sombre et fancy à partir de l'ID du cours
  generateFancyDarkGradientFromId(id: number): string {
    const darkColors = [
      '#1A1A2E', '#16213E', '#0F3460', '#1F4068', '#2C3E50', '#34495E',
      '#2C3A47', '#1E272E', '#1B2631', '#1C2833', '#212F3D', '#1B2631',
    ];

    const vibrantColors = [
      '#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D3', '#A29BFE', '#6C5CE7',
      '#FF7675', '#FDCB6E', '#00B894', '#00CEC9', '#74B9FF', '#0984E3',
    ];

    // Utiliser l'ID pour sélectionner une couleur sombre et une couleur vibrante
    const darkColor = darkColors[id % darkColors.length];
    const vibrantColor = vibrantColors[(id + 1) % vibrantColors.length];

    // Créer un dégradé linéaire avec une touche de couleur vibrante
    return `linear-gradient(135deg, ${darkColor}, ${vibrantColor})`;
  }
}