import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDebounceComponent } from './search-debounce.component';

describe('SearchDebounceComponent', () => {
  let component: SearchDebounceComponent;
  let fixture: ComponentFixture<SearchDebounceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchDebounceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchDebounceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
