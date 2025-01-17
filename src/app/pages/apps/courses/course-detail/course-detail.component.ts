import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../course';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ChangeDetectorRef } from '@angular/core';
import { ColorService } from '../color.service';
import { CourseService } from '../course.service';
import { Homework } from '../homework';
import { CustomDatePipe } from '../custom-date.pipe';
import { MatTabsModule } from '@angular/material/tabs';
import { Post } from '../Post';
import { CourseComment } from '../comment';

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
    TablerIconsModule,
  ],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent implements OnInit {
  courseDetail: Course | null = null;
  headerGradient: string = 'linear-gradient(135deg, #333, #333)';
  homeworks: Homework[] = [];
  posts: Post[] = [];
  comments: { [postId: number]: CourseComment[] } = {};
  newComment: { [postId: number]: string } = {};
  showCommentForm: { [postId: number]: boolean } = {}; // Pour gérer l'affichage du formulaire d'ajout de commentaire
  showComments: { [postId: number]: boolean } = {}; // Pour gérer l'affichage des commentaires

  // Propriétés pour le formulaire de post
  isTeacher = true;
  isPostFormOpen = false;
  newPost = { content: '' };
  isSubmitting = false;

  // Propriétés pour le formulaire de devoir
  isHomeworkFormOpen = false;
  newHomework = {
    title: '',
    description: '',
    day: null as number | null,
    month: null as number | null,
    year: null as number | null,
    time: '',
    courseId: 0,
  };
  isHomeworkSubmitting = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private colorService: ColorService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.courseDetail = navigation.extras.state['course'];
    } else {
      const courseFromLocalStorage = localStorage.getItem('currentCourse');
      if (courseFromLocalStorage) {
        this.courseDetail = JSON.parse(courseFromLocalStorage);
      } else {
        console.error('Aucune donnée de cours trouvée.');
      }
    }

    if (this.courseDetail) {
      this.headerGradient = this.colorService.generateFancyDarkGradientFromId(this.courseDetail.id);
      this.loadHomeworks(this.courseDetail.id);
      this.loadPosts(this.courseDetail.id);
    }

    this.cdr.detectChanges();
  }

  // Méthode pour charger les commentaires d'un post
  loadComments(postId: number): void {
    this.courseService.getCommentsByPostId(postId).subscribe(
      (comments) => {
        this.comments[postId] = comments;
      },
      (error) => {
        console.error('Erreur lors de la récupération des commentaires :', error);
      }
    );
  }

  // Méthode pour ajouter un commentaire
  addComment(postId: number): void {
    const content = this.newComment[postId];
    if (!content) {
      console.error('Le contenu du commentaire est requis.');
      return;
    }

    this.courseService.createComment(postId, { content }).subscribe(
      () => {
        // Recharger les commentaires après en avoir ajouté un nouveau
        this.loadComments(postId);
        this.newComment[postId] = ''; // Réinitialiser le champ de commentaire
        this.showCommentForm[postId] = false; // Masquer le formulaire après l'ajout
      },
      (error) => {
        console.error('Erreur lors de la création du commentaire :', error);
      }
    );
  }

  // Méthode pour supprimer un commentaire
  deleteComment(postId: number, commentId: number): void {
    this.courseService.deleteComment(postId, commentId).subscribe(
      () => {
        this.comments[postId] = this.comments[postId].filter((c) => c.id !== commentId);
      },
      (error) => {
        console.error('Erreur lors de la suppression du commentaire :', error);
      }
    );
  }

  // Méthode pour charger les posts
  loadPosts(courseId: number): void {
    this.courseService.getPostsByCourseId(courseId).subscribe(
      (posts) => {
        this.posts = posts;
        console.log('Posts récupérés :', this.posts);

        // Charger les commentaires pour chaque post
        this.posts.forEach((post) => {
          this.loadComments(post.id);
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des posts :', error);
      }
    );
  }

  // Méthodes pour les posts
  togglePostForm(): void {
    this.isPostFormOpen = !this.isPostFormOpen;
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    if (this.newPost.content) {
      const newPost = {
        content: this.newPost.content,
      };

      this.courseService.createPost(this.courseDetail!.id, newPost).subscribe(
        (response) => {
          this.posts.push(response); // Ajouter le post à la liste
          this.newPost = { content: '' }; // Réinitialiser le formulaire
          this.isSubmitting = false;
          this.isPostFormOpen = false;
        },
        (error) => {
          console.error('Erreur lors de la création du post :', error);
          console.error('Détails de l\'erreur :', error.error);
          this.isSubmitting = false;
        }
      );
    } else {
      console.error('Le contenu du post est requis.');
      this.isSubmitting = false;
    }
  }

  // Méthodes pour les devoirs
  loadHomeworks(courseId: number): void {
    this.courseService.getHomeworksByCourseId(courseId).subscribe(
      (homeworks) => {
        this.homeworks = homeworks;
      },
      (error) => {
        console.error('Erreur lors de la récupération des devoirs :', error);
      }
    );
  }

  toggleHomeworkForm(): void {
    this.isHomeworkFormOpen = !this.isHomeworkFormOpen;
  }

  onHomeworkSubmit(): void {
    if (this.isHomeworkSubmitting) return;
    this.isHomeworkSubmitting = true;

    // Logique pour créer un devoir
    // ...
  }

  cancelHomeworkForm(): void {
    this.isHomeworkFormOpen = false;
    this.isHomeworkSubmitting = false;
    this.newHomework = { title: '', description: '', day: null, month: null, year: null, time: '', courseId: 0 };
  }

  goBack(): void {
    this.router.navigate(['/apps/courses']);
  }

  // Méthode pour basculer l'affichage des commentaires
  toggleShowComments(postId: number): void {
    this.showComments[postId] = !this.showComments[postId];
  }

  // Méthode pour basculer l'affichage du formulaire d'ajout de commentaire
  toggleShowCommentForm(postId: number): void {
    this.showCommentForm[postId] = !this.showCommentForm[postId];
  }
}