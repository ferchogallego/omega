import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovedadesSecursalesComponent } from './novedades-secursales.component';

describe('NovedadesSecursalesComponent', () => {
  let component: NovedadesSecursalesComponent;
  let fixture: ComponentFixture<NovedadesSecursalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovedadesSecursalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovedadesSecursalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
