/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import { Request, Response } from 'express';
import { Http, BaseError, Log, HTTP_NOT_FOUND } from 'blueskyfish-express-commons';

import {
	ActionFunc,
	IActionItem,
	IActionMap,
	IActionPool
} from './action.models';
import { IContext } from './context.models';
import { HttpContext } from './context';

export const ACTION_TAG = 'action';

/**
 * The action pool with the collected action.
 */
export abstract class ActionPool<CTX extends IContext> implements IActionPool {

	private _actionMap: IActionMap<CTX> = {};

	protected get actionMap(): IActionMap<CTX> {
		return this._actionMap;
	}

	/**
	 * Returns all actions from the pool.
	 */
	get actions(): string[] {
		return Object.keys(this.actionMap);
	}

	/**
	 * Add a new action to the pool. A former action with the same name is override.
	 *
	 * @param {string} name the name of the action
	 * @param {ActionFunc} action the action function
	 * @param {string} roles the list of roles for the current execution
	 * @return {ActionPool}
	 */
	addAction(name: string, action: ActionFunc<CTX>, ...roles: string[]): ActionPool<CTX> {
		Log.trace(ACTION_TAG, 'add action (%s)', name);
		this._actionMap[name] = {
			name: name,
			roles: roles,
			action: action
		} as IActionItem<CTX>;
		return this;
	}

	/**
	 * Check, if the action is known in the pool.
	 *
	 * @param {string} name the name of the action
	 * @return {boolean}
	 */
	has(name: string): boolean {
		return !!this.actionMap[name];
	}

	/**
	 * Override in the concrete classes
	 */
	abstract execute(name: string, req: Request, res: Response): Promise<boolean>;
}

/**
 * Base implementation of the action pool with the IContext
 */
export class BaseActionPool extends ActionPool<IContext> {

	async execute(name: string, req: Request, res: Response): Promise<boolean> {
		Log.trace(ACTION_TAG, '%s -> (%s:%s)', name, req.method, req.originalUrl);
		const item: IActionItem<IContext> = this.actionMap[name];
		if (item) {
			const ctx: IContext = new HttpContext(req, res);
			try {
				await item.action(ctx);
			} catch (e) {
				ctx.sendError(e);
				return Promise.resolve(false);
			}
			return Promise.resolve(true);
		}
		Http.sendError(res, new BaseError(ACTION_TAG, 'action', 'unknown url', HTTP_NOT_FOUND));
		return Promise.resolve(false);
	}
}
