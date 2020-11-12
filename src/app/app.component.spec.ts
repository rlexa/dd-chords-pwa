import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {detectChanges, overrideForChangeDetection} from './test';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
    })
      .overrideComponent(AppComponent, overrideForChangeDetection)
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    detectChanges(fixture);
  });

  it('has instance', () => expect(fixture.componentInstance).toBeTruthy());
  it('renders', () => expect(fixture).toMatchSnapshot());
});
