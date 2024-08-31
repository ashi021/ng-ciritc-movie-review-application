import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment/comment.service';
import { AuthService } from '../../services/auth/auth.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() movieId!: string; // Ensure this is correctly provided by the parent component
  commentForm: FormGroup;
  stars: number[] = [1, 2, 3, 4, 5];
  rating: number | null = null;
  comments: any[] = []; // Replace `any` with the actual comment type if possible

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private authService: AuthService
  ) {
    this.commentForm = this.fb.group({
      title: ['', Validators.required],
      rating: [null, Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.movieId) {
      this.loadComments();
    } else {
      console.error('Movie ID is not provided.');
    }
  }

  async loadComments() {
    try {
      const fetchedComments = await firstValueFrom(this.commentService.getAllComments());
      this.comments = fetchedComments.filter(comment => comment.movieId === this.movieId);
    } catch (error) {
      console.error('Error loading comments:', error);
      this.comments = []; // Ensure comments is always an array
    }
  }

  async addComment() {
    if (this.commentForm.valid && this.rating !== null) {
      const { title, description } = this.commentForm.value;
      const uid = this.authService.getUid();

      if (!uid) {
        console.error('User is not authenticated.');
        return;
      }

      try {
        const hasCommented = await this.commentService.userHasCommented(this.movieId, uid);
        if (hasCommented) {
          alert('You have already commented on this movie.');
          return;
        }

        await this.commentService.addComment(title, this.rating, description, this.movieId);
        this.commentForm.reset();
        this.rating = null; // Reset rating
        this.loadComments();
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    } else {
      console.error('Please fill out all fields and select a rating.');
    }
  }

  setRating(rating: number) {
    this.rating = rating;
    this.commentForm.patchValue({ rating });
  }

  get averageRating(): number | null {
    if (this.comments.length === 0) {
      return null;
    }

    const totalRating = this.comments.reduce((acc, comment) => acc + (comment.rating || 0), 0);
    const average = totalRating / this.comments.length;
    return parseFloat(average.toFixed(1));
  }

  formatTimestamp(timestamp: any): string {
    if (!timestamp) {
      return 'No date available'; // Handle cases where timestamp is missing
    }

    // Check if timestamp is a Firestore Timestamp object or a Date object
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp.seconds * 1000);

    if (isNaN(date.getTime())) {
      return 'Invalid date'; // Handle invalid date
    }

    return date.toLocaleString(); // Formats to 'MM/DD/YYYY, HH:MM:SS AM/PM' format
  }
}
