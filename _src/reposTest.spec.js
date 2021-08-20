import axiosInstance from '../default.config';
import { testUser, expToken } from '../_resource/testData';
import { expect } from 'chai';

describe('GitHub repos tests', async () => {
  it('Should get public repositories list', async () => {
    const response = await axiosInstance.get(`/users/${testUser.userName}/repos`);

    expect(response.status).equal(200);
    expect(response.data.length).equal(2);
  });

  it('Should get all repositories list', async () => {
    const response = await axiosInstance.get('/user/repos', {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
        accept: 'application/vnd.github.v3+json',
      },
    });
    expect(response.status).equal(200);
    expect(response.data.length).equal(4);
  });

  it('Should not get all repositories list without token', async () => {
    try {
      await axiosInstance.get('/user/repos', {
        headers: {
          Authorization: '',
          accept: 'application/vnd.github.v3+json',
        },
      });
    } catch (err) {
      expect(err.response.status).equal(401);
    }
  });

  it('Should not get all repositories list with expired token', async () => {
    try {
      await axiosInstance.get('/user/repos', {
        headers: {
          Authorization: `Bearer ${expToken}`,
          accept: 'application/vnd.github.v3+json',
        },
      });
    } catch (err) {
      expect(err.response.status).to.equal(401);
    }
  });
});
