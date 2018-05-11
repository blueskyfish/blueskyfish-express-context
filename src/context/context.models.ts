/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import { IBaseError } from 'blueskyfish-express-commons';
import { DBConnection } from 'blueskyfish-express-mysql';
import { Request } from 'express';
import { IAuthUser } from '..';

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

	getParam(name: string|number, def?: string): string;

	getParamInt(name: string|number, def: number): number;

	getBody<T>(): T;

	getSetting<T>(name: string): T;

	/**
	 * Get the header of the request.
	 *
	 * @param {string} name the name of the header
	 * @return {string} the value or null
	 */
	getHeader(name: string): string;

	/**
	 * Set the header of the response.
	 *
	 * @param {string} name the name of the header
	 * @param {string} value the value
	 */
	setHeader(name: string, value: string): void;

	/**
	 * Send the http status code only.
	 *
	 * @param {number} status the http status code.
	 */
	sendStatus(status: number): void;

	sendData(data: any);

	sendMedia(mimeType: string, data: string|Buffer): void;

	/**
	 * Send an error to the client.
	 *
	 * @param {IBaseError} reason
	 */
	sendError(reason: IBaseError);

	/**
	 * Render the html from the given template and data and send to the client (200 -> text/html)
	 *
	 * @param {string} template
	 * @param data
	 */
	renderView(template: string, data): void;
}
