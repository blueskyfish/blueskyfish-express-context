/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import { BaseError } from 'blueskyfish-express-commons'
import { DBConnection } from 'blueskyfish-express-mysql';
import { Request } from 'express';
import { IAuthUser } from '../auth/auth.models';

export type AppFunc<T> = (req: Request) => T;

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

	/**
	 * Returns the value from the express request.
	 *
	 * @param {AppFunc<*>} appFunc
	 * @return {*}
	 */
	getAppValue<T>(appFunc: AppFunc<T>): T;

	getParam(name: string, def?: string): string;

	getParamInt(name: string, def: number): number;

	getBody<T>(): T;

	getSetting<T>(name: string): T;

	sendData(data: any);

	sendError(reason: BaseError);
}
