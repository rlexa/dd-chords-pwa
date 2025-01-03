import {MockBuilder, MockedComponentFixture, MockRender} from 'ng-mocks';
import {AppComponent} from './app.component';

describe('AppComponent', () => {
  let fixture: MockedComponentFixture<AppComponent>;

  beforeEach(() => MockBuilder(AppComponent));

  beforeEach(() => {
    fixture = MockRender(AppComponent);
    fixture.detectChanges();
  });

  it('has instance', () => expect(fixture.componentInstance).toBeTruthy());

  it('renders', () => expect(fixture).toMatchSnapshot());
});
