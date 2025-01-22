import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    DatePipe,
  ],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() courseId: number = 0; // Reçoit l'ID du cours du parent
  @Input() isTeacher: boolean = false; // Reçoit le statut de l'utilisateur

  posts: any[] = [];
  comments: { [postId: number]: any[] } = {};
  newComment: { [postId: number]: string } = {};
  showCommentForm: { [postId: number]: boolean } = {};
  showComments: { [postId: number]: boolean } = {};
  isPostFormOpen = false;
  newPost = { content: '', files: [] as File[] };
  isSubmitting = false;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadPosts(this.courseId); // Charge les posts au démarrage
  }

  loadPosts(courseId: number): void {
    this.courseService.getPostsByCourseId(courseId).subscribe(
      (posts) => {
        this.posts = posts;
        console.log('Posts récupérés :', this.posts); 
      },
      (error) => {
        console.error('Erreur lors de la récupération des posts :', error);
      }
    );
  }

  togglePostForm(): void {
    this.isPostFormOpen = !this.isPostFormOpen;
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    if (this.newPost.content || this.newPost.files.length > 0) {
      const formData = new FormData();
      formData.append('content', this.newPost.content);

      if (this.newPost.files && this.newPost.files.length > 0) {
        for (const file of this.newPost.files) {
          formData.append('files', file);
        }
      }

      this.courseService.createPost(this.courseId, formData).subscribe(
        (response) => {
          this.posts.unshift(response);
          this.newPost = { content: '', files: [] };
          this.isSubmitting = false;
          this.isPostFormOpen = false;
        },
        (error) => {
          console.error('Erreur lors de la création du post :', error);
          this.isSubmitting = false;
        }
      );
    } else {
      console.error('Le contenu du post ou des fichiers sont requis.');
      this.isSubmitting = false;
    }
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.newPost.files = Array.from(event.target.files);
    }
  }

  removeFile(file: File): void {
    this.newPost.files = this.newPost.files.filter((f) => f !== file);
  }

  deletePost(postId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      this.courseService.deletePost(postId).subscribe(
        () => {
          this.posts = this.posts.filter((post) => post.id !== postId);
        },
        (error) => {
          console.error('Erreur lors de la suppression du post :', error);
        }
      );
    }
  }

  toggleShowComments(postId: number): void {
    this.showComments[postId] = !this.showComments[postId];
    if (this.showComments[postId]) {
      this.loadComments(postId);
    }
  }

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

  toggleShowCommentForm(postId: number): void {
    this.showCommentForm[postId] = !this.showCommentForm[postId];
  }

  addComment(postId: number): void {
    const content = this.newComment[postId];
    if (!content) {
      console.error('Le contenu du commentaire est requis.');
      return;
    }

    this.courseService.createComment(postId, { content }).subscribe(
      () => {
        this.loadComments(postId); // Recharger les commentaires après ajout
        this.newComment[postId] = '';
        this.showCommentForm[postId] = false;
      },
      (error) => {
        console.error('Erreur lors de la création du commentaire :', error);
      }
    );
  }

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

  getFileUrl(fileId: number): string {
    return this.courseService.getFileUrl(fileId);
  }

  downloadFile(fileId: number, fileName: string): void {
    this.courseService.getFileById(fileId).subscribe(
      (file: Blob) => {
        const url = window.URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Erreur lors du téléchargement du fichier :', error);
      }
    );
  }
}