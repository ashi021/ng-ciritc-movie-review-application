import { Component } from '@angular/core';
import { MovieService } from '../../services/movie/movie.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar', // Defines the component selector
  standalone: true, // Marks this component as standalone
  imports: [CommonModule], // Imports necessary modules
  templateUrl: './search-bar.component.html', // Path to the component's HTML template
  styleUrl: './search-bar.component.css' // Path to the component's CSS file
})
export class SearchBarComponent {
  searchQuery: string = ''; // The search query entered by the user
  filteredMovies: any[] = []; // Array to hold the filtered movie results
  isLoading: boolean = false; // Indicates if the search is in progress
  error: string | null = null; // Holds error message if search fails

  constructor(private movieService: MovieService, private router: Router) {}

  searchMovie(event: Event) {
    const input = event.target as HTMLInputElement; // Get the input element from the event
    this.searchQuery = input.value; // Update search query with user input

    if (this.searchQuery.trim().length > 2) { // Start searching after 3 characters
      this.isLoading = true; // Set loading to true while searching
      this.error = null; // Reset error message

      // Call the movie service to search for movies
      this.movieService.searchMovies(this.searchQuery).subscribe({
        next: (response) => {
          this.filteredMovies = response.results; // Update filtered movies with the response
          this.isLoading = false; // Set loading to false after the search is complete
        },
        error: (err) => {
          console.error('Search error:', err); // Log error
          this.error = 'An error occurred while searching. Please try again.'; // Set error message
          this.isLoading = false; // Set loading to false after error
        }
      });
    } else {
      this.filteredMovies = []; // Clear filtered movies if query is too short
    }
  }

  goToMoviePage(movieId: number) {
    this.router.navigate(['/movie', movieId]); // Navigate to the movie details page
    this.searchQuery = ''; // Clear the search query
    this.filteredMovies = []; // Clear the filtered movies list
  }
}
