import { Prisma } from '@prisma/client';
import { prisma } from '@/config';
import { request } from '@/utils/request';

async function createSession(data: Prisma.SessionUncheckedCreateInput) {
  return prisma.session.create({
    data,
  });
}

async function findSession(token: string) {
  return prisma.session.findFirst({
    where: {
      token,
    },
  });
}
async function exchangeCodeForAcessToken(code: string){
  const accessToken = await request.AccesCodeRequest(code);
  return accessToken;
}
async function fetchUserFromGitHub(token: string){
  const userInfo = await request.fetchUser(token);
  return userInfo;
}
export const authenticationRepository = {
  createSession,
  findSession,
  exchangeCodeForAcessToken,
  fetchUserFromGitHub
};
