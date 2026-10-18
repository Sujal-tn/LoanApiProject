import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForeClosure } from './fore-closure';

describe('ForeClosure', () => {
  let component: ForeClosure;
  let fixture: ComponentFixture<ForeClosure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForeClosure]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForeClosure);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
