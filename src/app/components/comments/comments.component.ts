import { Component, Input, OnInit } from '@angular/core';  // Import necessary Angular components
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Import form-related utilities
import { CommentService } from '../../services/comment/comment.service';  // Import comment service for managing comments
import { AuthService } from '../../services/auth/auth.service';  // Import authentication service for user-related actions
import { firstValueFrom } from 'rxjs';  // Import rxjs function to convert observable to promise
import { CommonModule } from '@angular/common';  // Import common Angular module
import { ReactiveFormsModule, FormsModule } from '@angular/forms';  // Import form handling modules

@Component({
  selector: 'app-comments',  // Component selector name
  standalone: true,  // This is a standalone component that doesn't depend on others
  imports: [CommonModule, ReactiveFormsModule, FormsModule],  // Import necessary modules for this component
  templateUrl: './comments.component.html',  // Path to HTML template file
  styleUrls: ['./comments.component.css']  // Path to CSS file for styling
})
export class CommentsComponent implements OnInit {
  @Input() movieId!: string;  // Input property to get movieId from parent component
  commentForm: FormGroup;  // FormGroup for handling the comment form
  stars: number[] = [1, 2, 3, 4, 5];  // Array for rating stars (1 to 5)
  rating: number | null = null;  // Variable to hold the rating value
  comments: any[] = [];  // Array to store fetched comments

  // Constructor to initialize the component with necessary services
  constructor(
    private fb: FormBuilder,  // FormBuilder to create the form group
    private commentService: CommentService,  // Service for handling comments
    private authService: AuthService  // Service for handling authentication
  ) {
    // Initializing the comment form with validation
    this.commentForm = this.fb.group({
      title: ['', Validators.required],  // Title of the comment, required field
      rating: [null, Validators.required],  // Rating, required field
      description: ['', Validators.required]  // Description of the comment, required field
    });
  }

  ngOnInit(): void {
    if (this.movieId) {  // Check if movieId is provided
      this.loadComments();  // Load comments for the given movieId
    } else {
      console.error('Movie ID is not provided.');  // Handle missing movieId
    }
  }

  // Method to load comments for the specific movie
  async loadComments() {
    try {
      // Fetch comments from the service
      const fetchedComments = await firstValueFrom(this.commentService.getAllComments());
      // Filter comments based on the provided movieId
      this.comments = fetchedComments.filter(comment => comment.movieId === this.movieId);
    } catch (error) {
      console.error('Error loading comments:', error);  // Log error if fetching fails
      this.comments = [];  // Reset comments to an empty array in case of error
    }
  }

  // Method to add a new comment
  async addComment() {
    if (this.commentForm.valid && this.rating !== null) {  // Check if the form is valid and rating is provided
      const { title, description } = this.commentForm.value;  // Extract form values
      const uid = this.authService.getUid();  // Get the user ID from authentication service

      if (!uid) {  // Check if user is authenticated
        console.error('User is not authenticated.');
        return;
      }

      try {
        // Check if the user has already commented on this movie
        const hasCommented = await this.commentService.userHasCommented(this.movieId, uid);
        if (hasCommented) {  // If the user has commented, show an alert
          alert('You have already commented on this movie.');
          return;
        }

        // Add the comment using the comment service
        await this.commentService.addComment(title, this.rating, description, this.movieId);
        this.commentForm.reset();  // Reset the form after adding the comment
        this.rating = null;  // Reset rating
        this.loadComments();  // Reload the comments after adding
      } catch (error) {
        console.error('Error adding comment:', error);  // Log error if adding the comment fails
      }
    } else {
      console.error('Please fill out all fields and select a rating.');  // Show error if form is invalid
    }
  }

  // Method to set the rating when a star is clicked
  setRating(rating: number) {
    this.rating = rating;  // Set the rating to the clicked star value
    this.commentForm.patchValue({ rating });  // Update the rating in the form
  }

  // Getter method to calculate the average rating from all comments
  get averageRating(): number | null {
    if (this.comments.length === 0) {
      return null;  // Return null if there are no comments
    }

    // Calculate the total rating from all comments
    const totalRating = this.comments.reduce((acc, comment) => acc + (comment.rating || 0), 0);
    // Calculate the average rating and round to 1 decimal place
    const average = totalRating / this.comments.length;
    return parseFloat(average.toFixed(1));  // Return the average rating
  }

  // Method to format the timestamp of the comment to a readable string
  formatTimestamp(timestamp: any): string {
    if (!timestamp) {
      return 'No date available';  // Handle cases where timestamp is missing
    }

    // Check if timestamp is a Firestore Timestamp object or a Date object
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp.seconds * 1000);

    if (isNaN(date.getTime())) {
      return 'Invalid date';  // Handle invalid date
    }

    return date.toLocaleString();  // Format the date to a readable string like 'MM/DD/YYYY, HH:MM:SS AM/PM'
  }
}
