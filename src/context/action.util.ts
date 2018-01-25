/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import { Request, RequestHandler, Response } from 'express';
import { IActionList } from './action.models';

/**
 * Helper maps the action list to the request handler
 * @param {IActionList} route
 * @param {string} actionName
 * @return {RequestHandler}
 */
export function toRouteHandler(route: IActionList, actionName: string): RequestHandler {
	return async function (req: Request, res: Response) {
		await route.execute(actionName, req, res);
	};
}
