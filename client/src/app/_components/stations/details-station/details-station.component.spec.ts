import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsStationComponent } from './details-station.component';

describe('DetailsStationComponent', () => {
  let component: DetailsStationComponent;
  let fixture: ComponentFixture<DetailsStationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsStationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
