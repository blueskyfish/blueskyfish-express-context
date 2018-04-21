/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import { NextFunction, Request, Response } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';
import { BaseError, Log, Http, HTTP_UNAUTHORIZED } from 'blueskyfish-express-commons';

import { authService } from './auth.service';
import { IAuthConfigMiddleware, IAuthUser } from "./auth.models";
import { AuthWhitelist } from './auth.whitelist';
import { AUTH_ERR_INVALIDATE, AUTH_ERR_MISSING_TOKEN, AUTH_HEADER_NAME, AUTH_TAG } from './auth.defines';

const _DUMMY_USER: IAuthUser = {
	userId: -1,
	roles: []
};

/**
 * Set the auth user.
 *
 * @param {e.Request} req
 * @param {IAuthUser} authUser
 * @private
 */
const _setAuthUser = (req: Request, authUser: IAuthUser): void => {
	(req as any).authUser = authUser;
};

/**
 * Middleware for validate the incoming request with the JWT token. With the config parameter
 *
 * @param {IAuthConfigMiddleware} config
 * @returns {Function}
 */
export function authVerify(config: IAuthConfigMiddleware): RequestHandlerParams {

	authService.init(config);

	const whiteList: AuthWhitelist = new AuthWhitelist(...config.whiteList);

	return function (req: Request, res: Response, next: NextFunction) {
		const isOkay = whiteList.verify(req.originalUrl);

		const token = Http.fromHeader(req, AUTH_HEADER_NAME);
		if (!token) {
			if (isOkay || config.verifyRigorous === false) {
				// the request is in the whitelist or create an dummy user
				_setAuthUser(req, _DUMMY_USER);
				return next();
			}
			Log.warn(AUTH_TAG, 'Missing auth token: %s', req.originalUrl);
			// send an error
			return Http.sendError(res,
				new BaseError(AUTH_TAG, AUTH_ERR_MISSING_TOKEN, 'Missing auth token', HTTP_UNAUTHORIZED));
		}

		let authUser: IAuthUser;
		try {
			authUser = authService.getAuthUser(token);
		} catch (e) {
			authUser = null;
		}
		if (!authUser) {
			if (isOkay || config.verifyRigorous === false) {
				// the request is in the whitelist or create an dummy user
				_setAuthUser(req, _DUMMY_USER);
				return next();
			}

			Log.warn(AUTH_TAG, 'Auth token is invalidate: %s: %s', req.method, req.originalUrl);
			// send an error
			return Http.sendError(res,
				new BaseError(AUTH_TAG, AUTH_ERR_INVALIDATE, 'Auth token is invalidate', HTTP_UNAUTHORIZED));
		}

		// pine the auth user to the request property 'authUser'
		_setAuthUser(req, authUser);

		next();
	};
}
