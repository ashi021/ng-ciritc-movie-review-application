import { Component } from '@angular/core';
import { MovieService } from '../../services/movie/movie.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  searchQuery: string = '';
  filteredMovies: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private movieService: MovieService, private router: Router) {}

  searchMovie(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;

    if (this.searchQuery.trim().length > 2) { // Start searching after 3 characters
      this.isLoading = true;
      this.error = null;

      this.movieService.searchMovies(this.searchQuery).subscribe({
        next: (response) => {
          this.filteredMovies = response.results;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Search error:', err);
          this.error = 'An error occurred while searching. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      this.filteredMovies = [];
    }
  }

  goToMoviePage(movieId: number) {
    this.router.navigate(['/movie', movieId]); // Adjust route as needed
    this.searchQuery = ''; // Clear the search query
    this.filteredMovies = []; // Clear the suggestions
  }
}
