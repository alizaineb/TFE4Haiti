import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphLineComponent } from './graph-line.component';

describe('GraphLineComponent', () => {
  let component: GraphLineComponent;
  let fixture: ComponentFixture<GraphLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
