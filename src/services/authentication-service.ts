import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { invalidCredentialsError } from '@/errors';
import { authenticationRepository, userRepository } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';
import { githubUserResume } from '@/utils/request';
import { userService } from '.';

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, 'password'),
    token,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await authenticationRepository.createSession({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

async function loginWithGitHub(code: string){
  const token = await authenticationRepository.exchangeCodeForAcessToken(code);
  if (!token) throw invalidCredentialsError();

  const userInformation: githubUserResume  = await authenticationRepository.fetchUserFromGitHub(token);
  const email = userInformation.email? `${userInformation.id}${userInformation.email}` : `${userInformation.id}@mail.com`;
  const password = `${userInformation.id}${userInformation.node_id}`


  const userTest = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if(!userTest){
    await userService.createUser({email, password});
  }

  const response = await signIn({email, password});
  return response;
}


export type SignInParams = Pick<User, 'email' | 'password'>;
export type SignInByGitHubParams = {code: String;};

type SignInResult = {
  user: Pick<User, 'id' | 'email'>;
  token: string;
};

type GetUserOrFailResult = Pick<User, 'id' | 'email' | 'password'>;

export const authenticationService = {
  signIn,
  loginWithGitHub
};
