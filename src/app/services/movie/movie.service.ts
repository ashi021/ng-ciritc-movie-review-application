import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = '61775b8548018c250c432798190b913a'; // Replace with your TMDB API key
  private apiUrl = `https://api.themoviedb.org/3`;

  constructor(private http: HttpClient) { }

  searchMovies(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`);
  }
  
  getMovieById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movie/${id}?api_key=${this.apiKey}`);
  }
  
  getGenres(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/genre/movie/list?api_key=${this.apiKey}`);
  }

  getLanguages(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/configuration/languages?api_key=${this.apiKey}`);
  }

  getMoviesByGenre(genreId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}`);
  }

  getMoviesByLanguage(languageCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/discover/movie?api_key=${this.apiKey}&with_original_language=${languageCode}`);
  }

  getPopularMovies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movie/popular?api_key=${this.apiKey}`);
  }

  getMovieVideos(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movie/${id}/videos?api_key=${this.apiKey}`);
  }
}
