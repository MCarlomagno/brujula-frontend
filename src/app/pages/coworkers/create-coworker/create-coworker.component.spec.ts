import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCoworkerComponent } from './create-coworker.component';

describe('CreateCoworkerComponent', () => {
  let component: CreateCoworkerComponent;
  let fixture: ComponentFixture<CreateCoworkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCoworkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCoworkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
