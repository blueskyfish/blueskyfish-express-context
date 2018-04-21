/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import { Log } from 'blueskyfish-express-commons';

import { AUTH_TAG } from './auth.defines';

/**
 * White list for auth urls
 */
export class AuthWhitelist {

	private _list: RegExp[] = [];

	constructor(...whiteList: string[]) {
		if (whiteList && whiteList.length > 0) {
			whiteList.forEach((path: string) => {
				this._list.push(createRegex(path));
			});
		}
		Log.trace(AUTH_TAG, 'Whitelist Pattern: \n\t%s', this._list.join('\n\t'));
	}

	verify(url: string): boolean {
		if (!url) {
			return false;
		}

		return this._list.findIndex((path: RegExp) => {
			path.lastIndex = 0;
			return path.test(url);
		}) >= 0;
	}
}

function createRegex(path: string): RegExp {
	const pattern = path.replace(/\*:d/g, '\\d+').replace(/\*:all/g, '[a-zA-Z0-9_\-]+').replace(/\*/g,'[a-zA-Z_-]+');
	return new RegExp('^' + pattern + '$', 'g');
}
