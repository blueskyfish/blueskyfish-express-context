/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

/**
 * The current version of the library
 */
export const version: string = '0.3.2';

export { AUTH_TAG } from './auth/auth.defines';
export { IAuthConfig, IAuthConfigMiddleware, IAuthUser } from './auth/auth.models';
export { AuthService, authService } from './auth/auth.service';
export { authVerify } from './auth/auth.middleware';
export { AuthWhitelist } from './auth/auth.whitelist';
export { getAuthUser } from './auth/auth.util';

export { IContext, AppFunc } from './context/context.models';
export { HttpContext } from './context/context';
export {
	ActionFunc,
	IActionItem,
	IActionPool,
	IActionMap,
	IActionRepository
} from './context/action.models';
export {
	ACTION_TAG,
	ActionPool,
	BaseActionPool
} from './context/action.pool';
export { ActionRepository } from './context/action.repository';
export { toRouteHandler } from './context/action.util';
