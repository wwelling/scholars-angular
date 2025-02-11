import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedModule } from '../shared.module';
import { YouTubeComponent } from './youtube.component';

describe('YouTubeComponent', () => {
  let component: YouTubeComponent;
  let fixture: ComponentFixture<YouTubeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YouTubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
