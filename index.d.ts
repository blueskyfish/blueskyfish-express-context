/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import { BaseError } from 'blueskyfish-express-commons';
import { DBConnection } from 'blueskyfish-express-mysql';
import { Request, RequestHandler, Response } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';
import { IActionMap } from './src/context/action.models';

declare namespace blueskyfishExpressContext {

	const AUTH_TAG: string;

	interface IAuthConfig {
		/**
		 * The userSecrets for the JWT verification
		 */
		secrets: string;
	}

	interface IAuthConfigMiddleware extends IAuthConfig {
		whiteList: string[];
	}

	/**
	 * The auth user
	 */
	export interface IAuthUser {
		userId: number;
		roles: string[];
	}

	class AuthService {
		init(config: IAuthConfig): void;
		createAuthUser(userId: number, roles: string[]): string;
		getAuthUser(token: string): IAuthUser;
	}

	const authService: AuthService;

	function getAuthUser(req: Request): IAuthUser

	class AuthWhitelist {
		constructor(whiteList: string[]);
		verify(url: string): boolean;
	}

	function authVerify(config: IAuthConfigMiddleware): RequestHandlerParams

	type AppFunc<T> = (req: Request) => T;

	interface IContext {
		readonly conn: DBConnection;
		readonly authUser: IAuthUser;
		getAppValue<T>(appFunc: AppFunc<T>): T;
		getParam(name: string, def?: string): string;
		getParamInt(name: string, def: number): number;
		getBody<T>(): T;
		getSetting<T>(name: string): T;
		sendData(data: any);
		sendError(reason: BaseError);
	}

	class HttpContext implements IContext {
		readonly conn: DBConnection;
		readonly authUser: IAuthUser;
		constructor(_req: Request, _res: Response);
		getAppValue<T>(appFunc: AppFunc<T>): T;
		getParam(name: string, def?: string): string;
		getParamInt(name: string, def: number): number;
		getBody<T>(): T;
		getSetting<T>(name: string): T;
		sendData(data: any);
		sendError(reason: BaseError);
	}

	const ACTION_TAG: string;

	type ActionFunc<T extends IContext> = (ctx: T) => void;

	interface IActionItem<CTX extends IContext> {
		name: string;
		roles: string[];
		action: ActionFunc<CTX>;
	}

	interface IActionMap<CTX extends IContext> {
		[name: string]: IActionItem<CTX>
	}

	interface IActionList {

		/**
		 * Try to execute an request action and write the response.
		 *
		 * Note: The method is execute with async / await pattern
		 *
		 * @param {string} name the action name
		 * @param {e.Request} req the request
		 * @param {e.Response} res the response
		 */
		execute(name: string, req: Request, res: Response): Promise<void>;
	}

	class ActionMap<CTX extends IContext> implements IActionList {
		protected readonly actionMap: IActionMap<CTX>;
		execute(name: string, req: Request, res: Response): Promise<void>;
		addAction(name: string, action: ActionFunc<CTX>, ...roles: string[]): ActionMap<CTX>;
	}

	class BaseActionMap extends ActionMap<IContext> {
		execute(name: string, req: Request, res: Response): Promise<void>;
	}

	/**
	 * Helper maps the action list to the request handler
	 * @param {IActionList} route
	 * @param {string} actionName
	 * @return {RequestHandler}
	 */
	function toRouteHandler(route: IActionList, actionName: string): RequestHandler
}

export = blueskyfishExpressContext;
