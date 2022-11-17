import { render } from '@testing-library/react';

import SharedAssets from './shared-assets';

describe('SharedAssets', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< SharedAssets />);
    expect(baseElement).toBeTruthy();
  });
});
