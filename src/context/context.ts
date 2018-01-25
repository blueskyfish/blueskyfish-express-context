/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import { Application, Request, Response } from 'express';
import { BaseError, Http, Util } from 'blueskyfish-express-commons';
import { DBConnection, getConnection } from 'blueskyfish-express-mysql';

import { AppFunc, IContext } from './context.models';
import { IAuthUser } from '../auth/auth.models';
import { getAuthUser } from '../auth/auth.util';

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

	getParam(name: string, def: string = null): string {
		const value = Http.fromPathParam(this._req, name);
		if (!value) {
			return Http.fromQueryParam(this._req, name);
		}
		return value || def;
	}

	getParamInt(name: string, def: number): number {
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

	sendData(data: any) {
		Http.sendData(this._res, data);
	}

	sendError(reason: BaseError) {
		Http.sendError(this._res, reason);
	}
}
