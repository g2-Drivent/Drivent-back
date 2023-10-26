import { Router } from 'express';
import { SignInGitHUb, singInPost } from '@/controllers';
import { validateBody } from '@/middlewares';
import { signInGitHubSchema, signInSchema } from '@/schemas';

const authenticationRouter = Router();

authenticationRouter.post('/sign-in', validateBody(signInSchema), singInPost);
authenticationRouter.post('/sign-in/github',validateBody(signInGitHubSchema),SignInGitHUb);

export { authenticationRouter };
