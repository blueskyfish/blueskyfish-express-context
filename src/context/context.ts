/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import { Application, Request, Response } from 'express';
import { Http, IBaseError, Util } from 'blueskyfish-express-commons';
import { DBConnection, getConnection } from 'blueskyfish-express-mysql';

import { AppFunc, IContext } from './context.models';
import { IAuthUser } from '..';
import { getAuthUser } from '..';

/**
 * The http implementation of the context. It use the request and response pair.
 */
export class HttpContext implements IContext {

	constructor(private _req: Request, private _res: Response) {
	}

	get conn(): DBConnection {
		return getConnection(this._req);
	}

	get authUser(): IAuthUser {
		return getAuthUser(this._req);
	}

	getAppValue<T>(appFunc: AppFunc<T>): T {
		return appFunc(this._req);
	}

	getParam(name: string|number, def: string = null): string {
		const value = Http.fromPathParam(this._req, name);
		if (!value && typeof name !== 'number') {
			return Http.fromQueryParam(this._req, name);
		}
		return value || def;
	}

	getParamInt(name: string|number, def: number): number {
		const text = this.getParam(name, '');
		return Util.toNumber(text, def);
	}

	getBody<T>(): T {
		return Http.getBody(this._req);
	}

	getSetting<T>(name: string): T {
		const app: Application = this._req.app;
		return app.get(name) as T;
	}

	/**
	 * Get the header of the request.
	 *
	 * @param {string} name the name of the header
	 * @return {string} the value or null
	 */
	getHeader(name: string): string {
		return Http.getHeader(this._req, name);
	}

	/**
	 * Set the header of the response.
	 *
	 * @param {string} name the name of the header
	 * @param {string} value the value
	 */
	setHeader(name: string, value: string): void {
		Http.setHeader(this._res, name, value);
	}

	/**
	 * Send the http status code only.
	 *
	 * @param {number} status the http status code.
	 */
	sendStatus(status: number): void {
		Http.sendStatus(this._res, status);
	}

	sendData(data: any) {
		Http.sendData(this._res, data);
	}

	sendMedia(mimeType: string, data: string|Buffer): void {
		Http.sendMedia(this._res, mimeType, data);
	}

	sendError(reason: IBaseError) {
		Http.sendError(this._res, reason);
	}


	/**
	 * Render the html from the given template and data and send to the client (200 -> text/html)
	 *
	 * @param {string} template
	 * @param {object} data
	 */
	renderView(template: string, data: any): void {
		Http.renderView(this._res, template, data);
	}
}
