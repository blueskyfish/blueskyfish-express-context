/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

export interface IAuthConfig {

	/**
	 * The userSecrets for the JWT verification
	 */
	secrets: string;
}

export interface IAuthConfigMiddleware extends IAuthConfig {

	whiteList: string[];

	/**
	 * Verify the auth user very rigorous (true) or less (false).
	 *
	 * Less means a dummy user with the user id -1 and no roles.
	 */
	verifyRigorous: boolean;
}

/**
 * The auth user
 */
export interface IAuthUser {
	userId: number;
	roles: string[];
}
