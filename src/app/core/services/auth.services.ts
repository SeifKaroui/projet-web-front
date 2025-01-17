// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken'; // Clé pour stocker le token dans le localStorage
  private hardcodedToken : string | null = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwN2ZjZGE2LWViZmMtNDEzNS1hMWRkLWUxMDAzZTYwODYxOSIsImZpcnN0TmFtZSI6InRlYWNoZXIxIiwibGFzdE5hbWUiOiJCZW4gZm91bGVuIiwidHlwZSI6InRlYWNoZXIiLCJpYXQiOjE3MzcxMjY1NTEsImV4cCI6MTc0OTEyNjU1MX0.l88VGqNw6NX1_wobU2sima0vqjWiAZ74IEtOqLwBFRg'; // Token codé en dur

  // Récupérer le token
  getToken(): string | null {
    // Retourner le token codé en dur
    return this.hardcodedToken;
  }

  // Enregistrer le token (non utilisé dans cette solution provisoire)
  setToken(token: string): void {
    // Cette méthode peut être laissée vide ou utilisée pour mettre à jour le token codé en dur
    this.hardcodedToken = token;
  }

  // Supprimer le token (non utilisé dans cette solution provisoire)
  removeToken(): void {
    // Cette méthode peut être laissée vide ou utilisée pour effacer le token codé en dur
    this.hardcodedToken = null;
  }
}