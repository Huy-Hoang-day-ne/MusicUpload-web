import { TestBed } from '@angular/core/testing';

import { UploadmusicService } from './uploadmusic.service';

describe('UploadmusicService', () => {
  let service: UploadmusicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadmusicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
