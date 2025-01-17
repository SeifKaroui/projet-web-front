import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private announcements: any[] = [];

  constructor() {
    console.log('AnnouncementService instancié'); // Ajoute ce log
  }

  // Récupérer toutes les annonces
  getAnnouncements(): Observable<any[]> {
    return of(this.announcements);
  }

  // Poster une nouvelle annonce
  postAnnouncement(announcement: any): Observable<any> {
    console.log('Ajout d\'une nouvelle annonce :', announcement);
    const newAnnouncement = {
      ...announcement,
      date: new Date().toISOString(),
    };
    this.announcements.unshift(newAnnouncement);
    console.log('Nouvelle liste des annonces :', this.announcements); // Ajoute ce log
    return of(newAnnouncement);
  }
}