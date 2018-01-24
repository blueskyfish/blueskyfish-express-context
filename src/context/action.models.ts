/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import { Request, Response } from 'express';

import { IContext } from './context.models';

export type ActionFunc<T extends IContext> = (ctx: T) => void;

export interface IActionItem<CTX extends IContext> {
	name: string;
	roles: string[];
	action: ActionFunc<CTX>;
}

export interface IActionMap<CTX extends IContext> {
	[name: string]: IActionItem<CTX>
}

export interface IActionList {

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
