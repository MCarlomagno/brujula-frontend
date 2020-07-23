import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCoworkerComponent } from './edit-coworker.component';

describe('EditCoworkerComponent', () => {
  let component: EditCoworkerComponent;
  let fixture: ComponentFixture<EditCoworkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCoworkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCoworkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
