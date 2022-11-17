import { sharedAssets } from './shared-assets';

describe('sharedAssets', () => {
    it('should work', () => {
        expect(sharedAssets()).toEqual('shared-assets');
    })
})