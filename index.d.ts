/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import { IBaseError } from 'blueskyfish-express-commons';
import { DBConnection } from 'blueskyfish-express-mysql';
import { Request, RequestHandler, Response } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';

declare namespace e {

	/**
	 * The current version of the library
	 */
	const version: string;

	const AUTH_TAG: string;

	interface IAuthConfig {
		/**
		 * The userSecrets for the JWT verification
		 */
		secrets: string;

	}

	interface IAuthConfigMiddleware extends IAuthConfig {
		whiteList: string[];

		/**
		 * Verify the auth user very rigorous (true) or less (false).
		 *
		 * Less means a dummy user with the user id -1 and no roles is set.
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

	class AuthService {
		init(config: IAuthConfig): void;

		/**
		 * Creates from the given data an auth user and create the JWT token.
		 *
		 * @param {number} userId
		 * @param {string[]} roles
		 * @returns {string}
		 */
		createAuthUser(userId: number, roles: string[]): string;

		/**
		 * Extract the auth user payload from the JWT token.
		 *
		 * @param {string} token
		 * @returns {IAuthUser}
		 * @throws {JsonWebTokenError}
		 */
		getAuthUser(token: string): IAuthUser;
	}

	/**
	 * Singleton of the auth provider.
	 *
	 * @type {AuthService}
	 */
	const authService: AuthService;

	/**
	 * Returns the auth user from the given express request.
	 *
	 * @param {e.Request} req
	 * @return {IAuthUser}
	 */
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
		getParam(name: string|number, def?: string): string;
		getParamInt(name: string|number, def: number): number;
		getBody<T>(): T;
		getSetting<T>(name: string): T;
		sendData(data: any);
		sendMedia(mimeType: string, data: string|Buffer): void;
		sendError(reason: IBaseError);

		/**
		 * Render the html from the given template and data and send to the client (200 -> text/html)
		 *
		 * @param {string} template
		 * @param data
		 * @deprecated  // TODO remove at version 0.2.0
		 */
		render(template: string, data: any): void;

		/**
		 * Render the html from the given template and data and send to the client (200 -> text/html)
		 *
		 * @param {string} template
		 * @param data
		 */
		renderView(template: string, data): void;
	}

	class HttpContext implements IContext {
		readonly conn: DBConnection;
		readonly authUser: IAuthUser;
		constructor(_req: Request, _res: Response);
		getAppValue<T>(appFunc: AppFunc<T>): T;
		getParam(name: string|number, def?: string): string;
		getParamInt(name: string|number, def: number): number;
		getBody<T>(): T;
		getSetting<T>(name: string): T;
		sendData(data: any);
		sendMedia(mimeType: string, data: string|Buffer): void;
		sendError(reason: IBaseError);

		/**
		 * Render the html from the given template and data and send to the client (200 -> text/html)
		 *
		 * @param {string} template
		 * @param data
		 * @deprecated  // TODO remove at version 0.2.0
		 */
		render(template: string, data: any): void;

		/**
		 * Render the html from the given template and data and send to the client (200 -> text/html)
		 *
		 * @param {string} template
		 * @param data
		 */
		renderView(template: string, data): void;
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

	/**
	 * An action pool combines almost different actions and provides the actions with their own context when executing them.
	 */
	interface IActionPool {

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

		/**
		 * Returns all actions from the pool.
		 */
		readonly actions: string[];

		/**
		 * Check, if the action is known in the pool.
		 *
		 * @param {string} name the name of the action
		 * @return {boolean}
		 */
		has(name: string): boolean;
	}

	/**
	 * @deprecated
	 */
	type IActionList = IActionPool;

	class ActionPool<CTX extends IContext> implements IActionPool {

		protected readonly actionMap: IActionMap<CTX>;

		/**
		 * Returns all actions from the pool.
		 */
		readonly actions: string[];

		/**
		 * Add a new action to the pool. A former action with the same name is override.
		 *
		 * @param {string} name the name of the action
		 * @param {ActionFunc} action the action function
		 * @param {string} roles the list of roles for the current execution
		 * @return {ActionPool}
		 */
		execute(name: string, req: Request, res: Response): Promise<void>;

		addAction(name: string, action: ActionFunc<CTX>, ...roles: string[]): ActionPool<CTX>;

		/**
		 * Check, if the action is known in the pool.
		 *
		 * @param {string} name the name of the action
		 * @return {boolean}
		 */
		has(name: string): boolean;
	}

	/**
	 * @deprecated
	 */
	type ActionMap<CTX extends IContext> = ActionPool<CTX>;

	class BaseActionPool extends ActionPool<IContext> {
		execute(name: string, req: Request, res: Response): Promise<void>;
	}

	/**
	 * @deprecated
	 */
	type BaseActionMap = BaseActionPool;

	/**
	 * The action repository manages all action pools together.
	 */
	export interface IActionRepository {

		/**
		 * Try to execute an request action and write the response.
		 *
		 * Note: The method is execute with async / await pattern
		 *
		 * @param {string} name the action name
		 * @param {e.Request} req the express request
		 * @param {e.Response} res the express response
		 * @return {Promise<boolean>} the method returns true (for success) or false (for error).
		 */
		execute(name: string, req: Request, res: Response): Promise<boolean>;
	}

	/**
	 * The action repository manages all action pools together.
	 */
	class ActionRepository implements IActionRepository {

		/**
		 * Add an action pool and maps all action names to the action pool internal.
		 *
		 * @param {IActionPool} actionPool
		 * @return {ActionRepository} itself
		 */
		addPool(actionPool: IActionPool): ActionRepository;

		/**
		 * Try to execute an request action and write the response.
		 *
		 * Note: The method is execute with async / await pattern
		 *
		 * @param {string} name the action name
		 * @param {e.Request} req the express request
		 * @param {e.Response} res the express response
		 * @return {Promise<boolean>} the method returns true (for success) or false (for error).
		 */
		execute(name: string, req: Request, res: Response): Promise<boolean>;
	}

	/**
	 * Helper maps the action list to the request handler
	 * @param {IActionPool|IActionRepository} routeOrRepository
	 * @param {string} actionName
	 * @return {RequestHandler}
	 */
	function toRouteHandler(routeOrRepository: IActionPool | IActionRepository, actionName: string): RequestHandler
}

export = e;
