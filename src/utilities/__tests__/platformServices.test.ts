import { useEnvironment } from '../platformServices';

jest.mock('@redhat-cloud-services/frontend-components/useChrome');

describe('getEnvironment', () => {
  it('returns the environment', () => {
    expect(useEnvironment()).toEqual('qa');
  });

  it('returns "ci" if environment is not specified', () => {
    jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
      __esModule: true,
      default: () => ({
        getEnvironment: () => {
          return;
        }
      })
    }));
    expect(useEnvironment()).toEqual('ci');
  });
});
