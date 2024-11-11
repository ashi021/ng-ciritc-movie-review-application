import { Component } from '@angular/core';  // Importing Component from Angular core

@Component({
  selector: 'app-about',  // The name of this component to be used in HTML
  standalone: true,  // This component is standalone and doesn't rely on others
  imports: [],  // No additional modules are being imported in this component
  templateUrl: './about.component.html',  // The HTML file for this component
  styleUrl: './about.component.css'  // The CSS file for this component
})
export class AboutComponent {
  // This class is empty, but it's the controller for the 'about' page of the app
}
