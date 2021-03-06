const applicationModelMock = require('../../../__mock__/applicationModel');

jest.mock('../../../../src/db/model', () => {
  return () => {
    return {
      Application: applicationModelMock,
    };
  };
});
const Naming = require('../../../../src/api/services/application/naming');

describe('Application Naming Service', () => {
  it('gen a parse name', () => {
    const parseName = Naming.genParseName('toto');
    expect(parseName.length).toBe(11);
    expect(parseName).toEqual(expect.stringMatching(/^[a-zA-Z0-9]{6}-toto$/));
  });

  it('gen an uniq parse name', async () => {
    applicationModelMock.exec.mockImplementationOnce(() =>
      Promise.resolve('first call'),
    );

    const namingService = new Naming();
    const parseName = await namingService.getUniqName('toto');

    expect(parseName.length).toBe(11);
    expect(applicationModelMock.exec).toHaveBeenCalledTimes(2);
  });
});
