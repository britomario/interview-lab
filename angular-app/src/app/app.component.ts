import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Importa o teu componente novo
import { SearchDebounceComponent } from './features/optimization/search-debounce/search-debounce.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // Adiciona aqui nos imports
  imports: [RouterOutlet, SearchDebounceComponent],
  template: `
    <main style="padding: 20px;">
      <h1>Interview Lab 🧪</h1>
      <hr>
      <app-search-debounce></app-search-debounce>
    </main>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-app';
}