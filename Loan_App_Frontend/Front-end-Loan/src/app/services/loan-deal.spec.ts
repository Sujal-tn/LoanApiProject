
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { LoandealService } from './loan-deal';

describe('LoandealService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideHttpClient()]
  }));

  it('is created', () => {
    expect(TestBed.inject(LoandealService)).toBeTruthy();
  });

});
