import { ComponentFixture, TestBed } from '@angular/core/testing';

import { APPComponent } from './app-edit.component';

describe('AppNewComponent', () => {
  let component: APPComponent;
  let fixture: ComponentFixture<APPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ APPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(APPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
