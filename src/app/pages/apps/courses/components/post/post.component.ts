import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { FileService } from '../../services/file.service';
import { ColorService } from '../../services/color.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../../../authentication/services/auth.service';

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
  courseId: number = 0; // Initialisez avec une valeur par défaut
  isTeacher: boolean = false;
  posts: any[] = [];
  comments: { [postId: number]: any[] } = {};
  newComment: { [postId: number]: string } = {};
  showCommentForm: { [postId: number]: boolean } = {};
  showComments: { [postId: number]: boolean } = {};
  isPostFormOpen = false;
  newPost = { content: '', files: [] as File[] };
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private fileService: FileService,
    public colorService: ColorService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.parent?.params.subscribe((params) => {
      this.courseId = +params['id']; // Récupérer l'ID du cours depuis l'URL
      this.isTeacher = this.authService.isTeacher(); // Vérifier si l'utilisateur est un enseignant
      this.loadPosts(this.courseId); // Charger les posts
    });
  }

  loadPosts(courseId: number): void {
    this.postService.getPostsByCourseId(courseId).subscribe(
      (posts) => {
        this.posts = posts;
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

    if (!this.courseId) {
      throw new Error('Course ID is missing.');
    }

    if (this.newPost.content || this.newPost.files.length > 0) {
      const formData = new FormData();
      formData.append('content', this.newPost.content);

      if (this.newPost.files && this.newPost.files.length > 0) {
        for (const file of this.newPost.files) {
          formData.append('files', file);
        }
      }

      this.postService.createPost(this.courseId, formData).subscribe(
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
      this.postService.deletePost(postId).subscribe(
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
    this.postService.getCommentsByPostId(postId).subscribe(
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

    this.postService.createComment(postId, { content }).subscribe(
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
    this.postService.deleteComment(postId, commentId).subscribe(
      () => {
        this.comments[postId] = this.comments[postId].filter((c) => c.id !== commentId);
      },
      (error) => {
        console.error('Erreur lors de la suppression du commentaire :', error);
      }
    );
  }

  downloadFile(fileId: number, filename: string): void {
    this.fileService.downloadFileBlob(fileId).subscribe({
      next: (file: Blob) => {
        const url = window.URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement du fichier :', error);
      }
    }
    );
  }

  getFileUrl(fileId: number): string {
    return this.fileService.getFileUrl(fileId)
  }

}
