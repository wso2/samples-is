/* eslint-disable */
export default {
  displayName: 'business-app-data-access-data-access-common-api-util',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': ['@swc/jest', { jsc: { transform: { react: { runtime: 'automatic' } } } }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/business-app/data-access/data-access-common-api-util'
};
