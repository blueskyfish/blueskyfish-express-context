/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import { BaseError } from 'blueskyfish-express-commons'
import { DBConnection } from 'blueskyfish-express-mysql';
import { IAuthUser } from '../auth/auth.models';

/**
 * The interface IContext is for the processing of an action.
 */
export interface IContext {

	/**
	 * The database connection.
	 */
	readonly conn: DBConnection;

	/**
	 * The user from the request header "Authorization".
	 */
	readonly authUser: IAuthUser;

	getParam(name: string, def?: string): string;

	getParamInt(name: string, def: number): number;

	getBody<T>(): T;

	getSetting<T>(name: string): T;

	sendData(data: any);

	sendError(reason: BaseError);
}
