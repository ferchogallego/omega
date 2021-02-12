import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialCorteComponent } from './historial-corte.component';

describe('HistorialCorteComponent', () => {
  let component: HistorialCorteComponent;
  let fixture: ComponentFixture<HistorialCorteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialCorteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialCorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
