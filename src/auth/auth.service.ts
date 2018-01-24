/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import * as jwt from 'jsonwebtoken';
import { BaseError } from 'blueskyfish-express-commons';

import { AUTH_ERR_INIT, AUTH_TAG } from './auth.defines';
import { IAuthConfig, IAuthUser } from "./auth.models";

const AUTH_PREFIX = 'Bearer';

export class AuthService {

	private _secrets: string = null;

	init(config: IAuthConfig): void {
		if (!config || !config.secrets) {
			throw new BaseError(AUTH_TAG, AUTH_ERR_INIT, 'Missing required parameters');
		}
		this._secrets = config.secrets;
	}

	/**
	 * Creates from the given data an auth user and create the JWT token.
	 * @param {number} userId
	 * @param {string[]} roles
	 * @returns {string}
	 */
	createAuthUser(userId: number, roles: string[]): string {
		if (!this._secrets) {
			throw new BaseError(AUTH_TAG, AUTH_ERR_INIT, 'Missing init of auth provider!');
		}
		const user: IAuthUser = {
			userId,
			roles
		};
		return jwt.sign(user, this._secrets);
	}

	/**
	 * Extract the auth user payload from the JWT token.
	 *
	 * @param {string} token
	 * @returns {IAuthUser}
	 * @throws {JsonWebTokenError}
	 */
	getAuthUser(token: string): IAuthUser {
		if (!this._secrets) {
			return null;
		}

		if (!token || !token.startsWith(AUTH_PREFIX)) {
			return null;
		}

		const verifyToken = token.substr(AUTH_PREFIX.length).trim();

		return jwt.verify(verifyToken, this._secrets) as IAuthUser;
	}
}

/**
 * Singleton of the auth provider.
 *
 * @type {AuthService}
 */
export const authService: AuthService = new AuthService();
