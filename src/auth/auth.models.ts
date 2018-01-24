/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

export interface IAuthConfigMiddleware extends IAuthConfig {

	whiteList: string[];
}

export interface IAuthConfig {

	/**
	 * The userSecrets for the JWT verification
	 */
	secrets: string;
}

/**
 * The auth user
 */
export interface IAuthUser {
	userId: number;
	roles: string[];
}
