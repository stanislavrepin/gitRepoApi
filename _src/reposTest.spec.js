import axiosInstance from '../default.config';
import { testUser, expToken, newRepo } from '../_resource/testData';
import { expect } from 'chai';

describe('GitHub repos tests', async () => {
  context('Get repositories', async () => {
    it('Should get public repositories list', async () => {
      await axiosInstance.get(`/users/${testUser.userName}/repos`).then((res) => {
        expect(res.status).equal(200);
        expect(res.data.length).equal(2);
      });
    });

    it('Should get all repositories list', async () => {
      await axiosInstance
        .get('/user/repos', {
          headers: {
            Authorization: `Bearer ${process.env.API_TOKEN}`,
            accept: 'application/vnd.github.v3+json',
          },
        })
        .then((res) => {
          expect(res.status).equal(200);
          expect(res.data.length).equal(4);
        });
    });

    it('Should not get all repositories list without token', async () => {
      await axiosInstance
        .get('/user/repos', {
          headers: {
            Authorization: '',
            accept: 'application/vnd.github.v3+json',
          },
        })
        .catch((err) => expect(err.response.status).equal(401));
    });
  });

  it('Should not get all repositories list with expired token', async () => {
    await axiosInstance
      .get('/user/repos', {
        headers: {
          Authorization: `Bearer ${expToken}`,
          accept: 'application/vnd.github.v3+json',
        },
      })
      .catch((err) => expect(err.response.status).equal(401));
  });
});

context('Create and modify repository', async () => {
  it('Should create new private repository for the authenticated user', async () => {
    await axiosInstance
      .post('/user/repos', newRepo, {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          accept: 'application/vnd.github.v3+json',
        },
      })
      .then((res) => expect(res.status).equal(201));
  });

  it('Should not create new private repository if it exist', async () => {
    await axiosInstance
      .post('/user/repos', newRepo, {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          accept: 'application/vnd.github.v3+json',
        },
      })
      .catch((err) => expect(err.response.status).equal(422));
  });

  it('Should delete repository', async () => {
    await axiosInstance
      .delete(`/repos/${testUser.userName}/${newRepo.name}`, {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          accept: 'application/vnd.github.v3+json',
        },
      })
      .then((res) => expect(res.status).equal(204));
  });
});

// .then((res) => console.log(res))
// .catch((err) => console.log(err));
