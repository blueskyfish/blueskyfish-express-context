/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import { Request, Response } from 'express';
import { IActionPool, IActionRepository } from './action.models';

interface IActionRepositoryMap {
	[name: string]: IActionPool;
}

/**
 * The action repository manages all action pools together.
 */
export class ActionRepository implements IActionRepository {

	private _map: IActionRepositoryMap = {};

	/**
	 * Add an action pool and maps all action names to the action pool internal.
	 *
	 * @param {IActionPool} actionPool
	 * @return {ActionRepository} itself
	 */
	addPool(actionPool: IActionPool): ActionRepository {
		if (actionPool) {
			for (let name of actionPool.actions) {
				this._map[name] = actionPool;
			}
		}
		return this;
	}

	async execute(name: string, req: Request, res: Response): Promise<boolean> {
		const actionPool: IActionPool = this._map[name];
		if (actionPool) {
			return actionPool.execute(name, req, res);
		}
		return Promise.reject(false);
	}
}
