import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { of, delay, Observable } from 'rxjs';

@Component({
  selector: 'app-search-debounce',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="search-container">
      <h3>🔍 Angular Search Optimization</h3>
      <p class="description">
        Techniques: <strong>Debounce</strong> (300ms) & <strong>SwitchMap</strong> (Race Condition handling).
      </p>

      <div class="input-group">
        <input 
          [formControl]="searchControl" 
          placeholder="Type a product name (e.g. 'phone')..." 
          class="search-input"
        >
        <span *ngIf="isLoading" class="spinner">🌀</span>
      </div>

      <div class="results-area">
        <p *ngIf="!isLoading && (results$ | async) === null" class="hint">
          Start typing to search...
        </p>
        
        <ul *ngIf="results$ | async as results">
          <li *ngFor="let item of results" class="result-item">
            {{ item }}
          </li>
          <li *ngIf="results.length === 0" class="no-result">No results found.</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .search-container { font-family: sans-serif; max-width: 400px; margin: 2rem auto; border: 1px solid #ddd; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .description { font-size: 0.9rem; color: #666; margin-bottom: 1rem; }
    .input-group { position: relative; margin-bottom: 1rem; }
    .search-input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    .spinner { position: absolute; right: 10px; top: 10px; }
    .results-area ul { list-style: none; padding: 0; margin: 0; border: 1px solid #eee; border-radius: 4px; }
    .result-item { padding: 8px 12px; border-bottom: 1px solid #eee; }
    .result-item:last-child { border-bottom: none; }
    .no-result { padding: 10px; color: #888; font-style: italic; }
    .hint { color: #999; font-style: italic; }
  `]
})
export class SearchDebounceComponent {
  // 1. Form Control to track input value
  searchControl = new FormControl('');
  
  // 2. Loading state for UI feedback
  isLoading = false;

  // 3. The Stream Definition (Declarative Approach)
  results$: Observable<string[]> = this.searchControl.valueChanges.pipe(
    // A. Wait 300ms after the user STOPS typing
    debounceTime(300),

    // B. Ignore if the next value is same as previous (e.g., user types 'a', deletes, types 'a' again fast)
    distinctUntilChanged(),

    // C. Side Effect: Turn on loading spinner
    tap(() => this.isLoading = true),

    // D. SwitchMap: The MVP. Cancels previous pending request if a new one comes in.
    switchMap(query => 
      this.mockApiCall(query || '').pipe(
        // Handle errors gracefully inside the stream
        catchError(err => {
          console.error(err);
          return of([]); // Return empty array on error
        })
      )
    ),

    // E. Side Effect: Turn off loading spinner
    tap(() => this.isLoading = false)
  );

  /**
   * MOCK API FUNCTION
   * Simulates a backend call with latency to demonstrate async handling.
   */
  private mockApiCall(query: string): Observable<string[]> {
    if (!query.trim()) return of([]); // Return empty if query is empty

    const allProducts = [
      'iPhone 15', 'iPhone 15 Pro', 'Samsung Galaxy S24', 
      'MacBook Air', 'MacBook Pro', 'Sony Headphones', 'iPad Air'
    ];

    // Simulate network delay (500ms - 1500ms random)
    const randomDelay = Math.floor(Math.random() * 1000) + 500;
    
    // Filter logic
    const filtered = allProducts.filter(p => 
      p.toLowerCase().includes(query.toLowerCase())
    );

    return of(filtered).pipe(delay(randomDelay));
  }
}