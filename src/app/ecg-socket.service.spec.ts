import { TestBed } from '@angular/core/testing';

import { EcgSocketService } from './ecg-socket.service';

describe('EcgSocketService', () => {
  let service: EcgSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcgSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
