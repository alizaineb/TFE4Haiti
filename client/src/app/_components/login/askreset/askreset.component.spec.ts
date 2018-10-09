import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskresetComponent } from './askreset.component';

describe('AskresetComponent', () => {
  let component: AskresetComponent;
  let fixture: ComponentFixture<AskresetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskresetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
