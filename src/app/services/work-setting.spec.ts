import { TestBed } from '@angular/core/testing';

import { WorkSetting } from './work-setting';

describe('WorkSetting', () => {
  let service: WorkSetting;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkSetting);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
