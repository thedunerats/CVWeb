import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathfindingvisualComponent } from './pathfindingvisual.component';

describe('PathfindingvisualComponent', () => {
  let component: PathfindingvisualComponent;
  let fixture: ComponentFixture<PathfindingvisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathfindingvisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathfindingvisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
