import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortingvisualizerComponent } from './sortingvisualizer.component';

describe('SortingvisualizerComponent', () => {
  let component: SortingvisualizerComponent;
  let fixture: ComponentFixture<SortingvisualizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortingvisualizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortingvisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
