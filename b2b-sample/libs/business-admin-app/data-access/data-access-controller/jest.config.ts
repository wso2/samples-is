/* eslint-disable */
export default {
  displayName: 'business-admin-app-data-access-data-access-controller',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': ['@swc/jest', { jsc: { transform: { react: { runtime: 'automatic' } } } }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/business-admin-app/data-access/data-access-controller'
};
