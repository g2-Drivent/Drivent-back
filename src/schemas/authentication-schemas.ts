import Joi from 'joi';
import { SignInByGitHubParams, SignInParams } from '@/services';

export const signInSchema = Joi.object<SignInParams>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const signInGitHubSchema = Joi.object<SignInByGitHubParams>({
  code: Joi.string().required()
});