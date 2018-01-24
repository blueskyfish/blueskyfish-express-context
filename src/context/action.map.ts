/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import { Request, Response } from 'express';
import { Http, BaseError, Log, HTTP_NOT_FOUND } from 'blueskyfish-express-commons';

import { ActionFunc, IActionItem, IActionList, IActionMap } from './action.models';
import { IContext } from './context.models';
import { HttpContext } from './context';

export const ACTION_TAG = 'action';

/**
 * The action map with the collected action.
 */
export abstract class ActionMap<CTX extends IContext> implements IActionList {

	protected _actionMap: IActionMap<CTX> = {};

	addAction(name: string, action: ActionFunc<CTX>, ...roles: string[]): ActionMap<CTX> {
		Log.trace(ACTION_TAG, 'add action (%s)', name);
		this._actionMap[name] = {
			name: name,
			roles: roles,
			action: action
		} as IActionItem<CTX>;
		return this;
	}

	/**
	 * Override in the concret classes
	 */
	abstract execute(name: string, req: Request, res: Response): Promise<void>;
}

/**
 * Base implementation of the action map with the IContext
 */
export class BaseActionMap extends ActionMap<IContext> {

	async execute(name: string, req: Request, res: Response): Promise<void> {
		Log.trace(ACTION_TAG, '%s -> (%s:%s)', name, req.method, req.originalUrl);
		const item: IActionItem<IContext> = this._actionMap[name];
		if (item) {
			const ctx: IContext = new HttpContext(req, res);
			try {
				await item.action(ctx);
			} catch (e) {
				ctx.sendError(e);
			}
			return;
		}
		Http.sendError(res, new BaseError(ACTION_TAG, 'action', 'unknown url', HTTP_NOT_FOUND));
		return Promise.resolve(null);
	}
}
