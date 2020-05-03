import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabasedemoComponent } from './databasedemo.component';

describe('DatabasedemoComponent', () => {
  let component: DatabasedemoComponent;
  let fixture: ComponentFixture<DatabasedemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabasedemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabasedemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
