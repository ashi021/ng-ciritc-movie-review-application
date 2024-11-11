import { Pipe, PipeTransform } from '@angular/core'; // Import necessary Angular modules for creating a pipe
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Import DomSanitizer to handle URL sanitization

@Pipe({
  name: 'safeUrl', // Define the name of the custom pipe
  standalone: true // Mark the pipe as standalone
})
export class SafeUrlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {} // Inject DomSanitizer service

    // Transform method that sanitizes the URL to make it safe for use in the template
    transform(url: string): SafeResourceUrl {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url); // Use the sanitizer to return a trusted URL
    }
}
