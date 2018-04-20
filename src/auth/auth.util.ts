/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import { Request } from 'express';
import { IAuthUser } from './auth.models';

/**
 * Returns the auth user from the given express request.
 *
 * @param {e.Request} req
 * @return {IAuthUser}
 */
export function getAuthUser(req: Request): IAuthUser {
	return (req as any).authUser;
}
