import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficsimComponent } from './trafficsim.component';

describe('TrafficsimComponent', () => {
  let component: TrafficsimComponent;
  let fixture: ComponentFixture<TrafficsimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrafficsimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrafficsimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
