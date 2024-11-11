import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  // For fetching route parameters like movie ID
import { MovieService } from '../../services/movie/movie.service';  // Movie service to fetch movie-related data
import { CommonModule } from '@angular/common';  // Common module for common Angular directives
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';  // Custom pipe for safe URL handling
import { CommentsComponent } from '../comments/comments.component';  // Component for displaying comments
import { firstValueFrom } from 'rxjs';  // Convert observable to promise for async/await usage
import { CommentService } from '../../services/comment/comment.service';  // Service for fetching comments

@Component({
  selector: 'app-movie',
  standalone: true,  // This component is standalone and imports its dependencies
  imports: [CommonModule, SafeUrlPipe, CommentsComponent],  // Necessary Angular modules and components
  templateUrl: './movie.component.html',  // Template for this component
  styleUrls: ['./movie.component.css']  // Styling for this component
})
export class MovieComponent implements OnInit {
  movie?: any;  // To hold the movie details
  trailerUrl: string | null = null;  // To store trailer URL
  genresMovies: Record<string, any[]> = {};  // Dictionary to store movies by genre
  isLoading: boolean = true;  // To track loading state
  error: string | null = null;  // To store error messages
  averageRating: number | null = null;  // To store the average rating of the movie

  constructor(
    private route: ActivatedRoute,  // ActivatedRoute to get movie ID from the route
    private movieService: MovieService,  // MovieService to fetch movie data
    private commentService: CommentService  // CommentService to fetch comments
  ) { }

  ngOnInit(): void {
    this.loadMovieData();  // Load movie data when the component is initialized
  }

  // Method to load movie data, handle errors, and manage state
  private async loadMovieData(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');  // Get movie ID from the route

    // Check if movie ID is available, otherwise set error
    if (!id) {
      this.error = 'Movie ID is not available';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;  // Start loading
    this.error = null;  // Clear previous errors

    try {
      // Fetch movie details by ID
      const movie = await firstValueFrom(this.movieService.getMovieById(id));
      this.movie = movie;
      console.log('Fetched movie:', this.movie);  // Log the fetched movie details

      // If movie genres are available, fetch movies for each genre
      if (this.movie && Array.isArray(this.movie.genres)) {
        const genreIds = this.movie.genres.map((genre: any) => genre.id);
        const genreNames = this.movie.genres.map((genre: any) => genre.name);

        // Fetch movies for each genre asynchronously
        for (let i = 0; i < genreIds.length; i++) {
          try {
            const response = await firstValueFrom(this.movieService.getMoviesByGenre(genreIds[i]));
            if (response && response.results) {
              if (!this.genresMovies[genreNames[i]]) {
                this.genresMovies[genreNames[i]] = [];
              }
              this.genresMovies[genreNames[i]].push(...response.results);
              console.log(`Movies for genre ${genreNames[i]}:`, this.genresMovies[genreNames[i]]);
            }
          } catch (error) {
            console.error(`Failed to fetch movies for genre ${genreNames[i]}`, error);
            this.error = 'Failed to fetch genre movies';
            this.isLoading = false;
            return;
          }
        }
      } else {
        console.warn('No genres available for the movie');
      }

      // Fetch trailer URL
      try {
        const videoResponse = await firstValueFrom(this.movieService.getMovieVideos(id));
        const trailer = videoResponse.results.find((video: any) => video.type === 'Trailer');
        if (trailer) {
          this.trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;  // Set the trailer URL
        }
      } catch (error) {
        console.error('Failed to fetch movie videos', error);
        this.error = 'Failed to fetch trailer';
      }

      // Fetch comments and calculate the average rating
      try {
        const fetchedComments = await firstValueFrom(this.commentService.getAllComments());
        const movieComments = fetchedComments.filter(comment => comment.movieId === id);  // Filter comments for this movie
        this.averageRating = this.calculateAverageRating(movieComments);  // Calculate average rating
      } catch (error) {
        console.error('Failed to fetch comments', error);
        this.error = 'Failed to fetch comments';
      }

    } catch (error) {
      console.error('Failed to fetch movie details', error);
      this.error = 'Failed to fetch movie details';
    } finally {
      this.isLoading = false;  // Stop loading after all operations
    }
  }

  // Method to calculate average rating from the comments
  private calculateAverageRating(comments: any[]): number | null {
    if (comments.length === 0) {
      return null;  // If no comments, return null
    }
    const totalRating = comments.reduce((acc, comment) => acc + (comment.rating || 0), 0);  // Sum up ratings
    return parseFloat((totalRating / comments.length).toFixed(1));  // Return average rating, rounded to 1 decimal place
  }
}
