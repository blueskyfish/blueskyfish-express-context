/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import { Log } from 'blueskyfish-express-commons';
import { Request, RequestHandler, Response } from 'express';
import { IActionPool, IActionRepository } from './action.models';
import { ACTION_TAG } from './action.pool';

/**
 * Helper maps the action list to the request handler
 * @param {IActionPool|IActionRepository} routeOrRepository
 * @param {string} actionName
 * @return {RequestHandler}
 */
export function toRouteHandler(routeOrRepository: IActionPool | IActionRepository, actionName: string): RequestHandler {
	return async function (req: Request, res: Response) {
		const result: boolean = await routeOrRepository.execute(actionName, req, res);
		if (!result) {
			Log.warn(ACTION_TAG, 'Unknown action "%s" -> "%s: %s"', actionName, req.method, req.originalUrl);
		}
	};
}

