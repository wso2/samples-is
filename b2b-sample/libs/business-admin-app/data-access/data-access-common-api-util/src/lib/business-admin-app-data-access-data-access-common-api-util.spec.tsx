import { render } from '@testing-library/react';

import BusinessAdminAppDataAccessDataAccessCommonApiUtil from './business-admin-app-data-access-data-access-common-api-util';

describe('BusinessAdminAppDataAccessDataAccessCommonApiUtil', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< BusinessAdminAppDataAccessDataAccessCommonApiUtil />);
    expect(baseElement).toBeTruthy();
  });
});
