/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import { Request, Response } from 'express';

import { IContext } from './context.models';

export type ActionFunc<T extends IContext> = (ctx: T) => void;

/**
 * An item in an action map
 */
export interface IActionItem<CTX extends IContext> {

	/**
	 * The name of the action
	 */
	name: string;

	/**
	 * A list of roles, that the current request needs.
	 */
	roles: string[];

	/**
	 * The action function
	 */
	action: ActionFunc<CTX>;
}

/**
 * An action map for the action name and the action function.
 */
export interface IActionMap<CTX extends IContext> {
	[name: string]: IActionItem<CTX>
}

/**
 * An action pool combines almost different actions and provides the actions with their own context when executing them.
 */
export interface IActionPool {

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
