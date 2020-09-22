import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyRoomHoursComponent } from './buy-room-hours.component';

describe('BuyRoomHoursComponent', () => {
  let component: BuyRoomHoursComponent;
  let fixture: ComponentFixture<BuyRoomHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyRoomHoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyRoomHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
