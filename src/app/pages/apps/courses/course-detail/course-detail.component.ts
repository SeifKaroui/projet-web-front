import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../course'; // Importez l'interface Course
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AnnouncementCardComponent } from '../announcement-card/announcement-card.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ChangeDetectorRef } from '@angular/core';
import { ColorService } from '../color.service'; // Importez le service ColorService
import { CourseService } from '../course.service'; // Importez le service CourseService
import { Homework } from '../homework'; // Importez l'interface Homework
import { CustomDatePipe } from '../custom-date.pipe'; // Importez le module
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    MatTabsModule,
    CustomDatePipe,
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    AnnouncementCardComponent,
    TablerIconsModule,
  ],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent implements OnInit {
  courseDetail: Course | null = null; // Détails du cours
  headerGradient: string = 'linear-gradient(135deg, #333, #333)'; // Dégradé sombre par défaut
  homeworks: Homework[] = []; // Liste des devoirs

  // Propriétés pour le formulaire d'annonce
  isTeacher = true; // À remplacer par la logique de vérification du rôle
  isAnnouncementFormOpen = false; // État du formulaire (ouvert/fermé)
  newAnnouncement = { title: '', description: '' }; // Nouvelle annonce
  isSubmitting = false; // État de soumission du formulaire
  announcements: any[] = []; // Liste des annonces

  // Propriétés pour le formulaire de devoir
  isHomeworkFormOpen = false; // État du formulaire (ouvert/fermé)
  newHomework = {
    title: '',
    description: '',
    day: null as number | null, // Jour (1-31)
    month: null as number | null, // Mois (1-12)
    year: null as number | null, // Année (AAAA)
    time: '', // Heure (HH:MM)
    courseId: 0,
  };
  isHomeworkSubmitting = false; // État de soumission du formulaire

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router, // Injecter Router
    private cdr: ChangeDetectorRef, // Injectez ChangeDetectorRef
    private colorService: ColorService, // Injectez ColorService
    private courseService: CourseService // Injectez CourseService
  ) {}


  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.courseDetail = navigation.extras.state['course'];
      console.log('Données du cours récupérées depuis l\'état de navigation :', this.courseDetail);
    } else {
      const courseFromLocalStorage = localStorage.getItem('currentCourse');
      if (courseFromLocalStorage) {
        this.courseDetail = JSON.parse(courseFromLocalStorage);
        console.log('Données du cours récupérées depuis le localStorage :', this.courseDetail);
      } else {
        console.error('Aucune donnée de cours trouvée dans l\'état de navigation ou le localStorage.');
      }
    }

    // Générer une couleur à partir de l'ID du cours
    if (this.courseDetail) {
      this.headerGradient = this.colorService.generateFancyDarkGradientFromId(this.courseDetail.id);
      this.loadHomeworks(this.courseDetail.id); // Charger les devoirs
    }

    // Forcez la détection de changement
    this.cdr.detectChanges();
  }

  // Lorsque vous récupérez les devoirs depuis l'API
  loadHomeworks(courseId: number): void {
    this.courseService.getHomeworksByCourseId(courseId).subscribe(
      (homeworks) => {
        this.homeworks = homeworks.map((hw) => ({
          ...hw,
          deadline: new Date(hw.deadline).toISOString().slice(0, 16), // Convertir en format yyyy-MM-ddThh:mm
          createdAt: new Date(hw.createdAt).toISOString(),
          updatedAt: new Date(hw.updatedAt).toISOString(),
          deletedAt: hw.deletedAt ? new Date(hw.deletedAt).toISOString() : null,
        }));
        console.log('Devoirs récupérés :', this.homeworks);
      },
      (error) => {
        console.error('Erreur lors de la récupération des devoirs :', error);
      }
    );
  }

  // Retour à la page précédente
  goBack(): void {
    this.router.navigate(['/apps/courses']);
  }

  // Basculer l'état du formulaire d'annonce
  toggleAnnouncementForm(): void {
    this.isAnnouncementFormOpen = !this.isAnnouncementFormOpen;
  }

  // Soumettre le formulaire d'annonce
  onSubmit(): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    if (this.newAnnouncement.title && this.newAnnouncement.description) {
      // Ajouter la date actuelle à l'annonce
      const newAnnouncement = {
        ...this.newAnnouncement,
        date: new Date(), // Ajoutez la date actuelle
      };

      // Ajouter la nouvelle annonce à la liste
      this.announcements.push(newAnnouncement);
      console.log('Annonce soumise :', newAnnouncement);

      // Réinitialiser le formulaire
      this.newAnnouncement = { title: '', description: '' };
      this.isSubmitting = false;
      this.isAnnouncementFormOpen = false; // Fermer le formulaire après soumission
    } else {
      console.error('Le titre et la description sont requis.');
      this.isSubmitting = false;
    }
  }

  // Basculer l'état du formulaire de devoir
  toggleHomeworkForm(): void {
    this.isHomeworkFormOpen = !this.isHomeworkFormOpen;
  }

  onHomeworkSubmit(): void {
    if (this.isHomeworkSubmitting) return;
    this.isHomeworkSubmitting = true;
  
    // Ajouter l'ID du cours au devoir
    if (this.courseDetail) {
      this.newHomework.courseId = this.courseDetail.id;
    }
  
    // Combiner les champs pour créer une date ISO
    const deadlineDate = new Date(
      this.newHomework.year!, // Année
      this.newHomework.month! - 1, // Mois (0-11)
      this.newHomework.day!, // Jour
      parseInt(this.newHomework.time.split(':')[0]), // Heure
      parseInt(this.newHomework.time.split(':')[1]) // Minute
    );
  
    // Convertir en chaîne ISO
    const deadlineISO = deadlineDate.toISOString();
  
    // Créer l'objet à envoyer à l'API
    const homeworkToSend = {
      title: this.newHomework.title,
      description: this.newHomework.description,
      deadline: deadlineISO, // Date au format ISO
      courseId: this.newHomework.courseId,
    };
  
    console.log('Données du devoir à envoyer :', homeworkToSend);
  
    // Envoyer la requête POST à l'API
    this.courseService.createHomework(homeworkToSend).subscribe(
      (response) => {
        console.log('Devoir créé avec succès :', response);
        this.homeworks.push(response); // Ajouter le devoir à la liste
        this.newHomework = { title: '', description: '', day: null, month: null, year: null, time: '', courseId: 0 }; // Réinitialiser le formulaire
        this.isHomeworkFormOpen = false; // Fermer le formulaire
        this.isHomeworkSubmitting = false;
      },
      (error) => {
        console.error('Erreur lors de la création du devoir :', error);
        this.isHomeworkSubmitting = false;
      }
    );
  }
}