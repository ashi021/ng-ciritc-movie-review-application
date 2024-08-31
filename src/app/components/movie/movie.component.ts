import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie/movie.service';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { CommentsComponent } from '../comments/comments.component';
import { firstValueFrom } from 'rxjs';
import { CommentService } from '../../services/comment/comment.service';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe, CommentsComponent],
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  movie?: any;
  trailerUrl: string | null = null;
  genresMovies: Record<string, any[]> = {}; // Use Record for type safety
  isLoading: boolean = true;
  error: string | null = null;
  averageRating: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private commentService: CommentService
  ) { }

  ngOnInit(): void {
    this.loadMovieData();
  }

  private async loadMovieData(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (!id) {
      this.error = 'Movie ID is not available';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      // Fetch movie details
      const movie = await firstValueFrom(this.movieService.getMovieById(id));
      this.movie = movie;
      console.log('Fetched movie:', this.movie); // Log the movie details

      if (this.movie && Array.isArray(this.movie.genres)) {
        const genreIds = this.movie.genres.map((genre: any) => genre.id);
        const genreNames = this.movie.genres.map((genre: any) => genre.name);

        // Fetch movies by genre
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
          this.trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
        }
      } catch (error) {
        console.error('Failed to fetch movie videos', error);
        this.error = 'Failed to fetch trailer';
      }

      // Fetch comments and calculate average rating
      try {
        const fetchedComments = await firstValueFrom(this.commentService.getAllComments());
        const movieComments = fetchedComments.filter(comment => comment.movieId === id);
        this.averageRating = this.calculateAverageRating(movieComments);
      } catch (error) {
        console.error('Failed to fetch comments', error);
        this.error = 'Failed to fetch comments';
      }

    } catch (error) {
      console.error('Failed to fetch movie details', error);
      this.error = 'Failed to fetch movie details';
    } finally {
      this.isLoading = false;
    }
  }

  private calculateAverageRating(comments: any[]): number | null {
    if (comments.length === 0) {
      return null;
    }
    const totalRating = comments.reduce((acc, comment) => acc + (comment.rating || 0), 0);
    return parseFloat((totalRating / comments.length).toFixed(1));
  }
}
