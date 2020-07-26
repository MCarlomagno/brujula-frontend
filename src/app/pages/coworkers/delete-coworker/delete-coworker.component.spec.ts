import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCoworkerComponent } from './delete-coworker.component';

describe('DeleteCoworkerComponent', () => {
  let component: DeleteCoworkerComponent;
  let fixture: ComponentFixture<DeleteCoworkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteCoworkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCoworkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
