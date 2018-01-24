/*
 * BlueSkyFish Express Context - https://github.com/blueskyfish/blueskyfish-express-context.git
 *
 * The MIT License (MIT)
 * Copyright 2018 BlueSkyFish
 */

import * as assert from 'assert';

import 'mocha';

import { Log, LogLevel } from 'blueskyfish-express-commons';

import { AuthWhitelist } from './auth.whitelist';

describe('Auth Whitelist', () => {

	before(() => {
		Log.init(LogLevel.Info);
	});

	it('Should validate urls', () => {
		const list = new AuthWhitelist(['/about', '/login']);
		assert(list.verify('/login'));
		assert(list.verify('/about'));
		assert(!list.verify('/user'));
		assert(!list.verify('/login/test'));
	});

	it ('Should validate wildcards in urls', () => {
		const list = new AuthWhitelist(['/text/*', '/text/*/details']);
		assert(!list.verify('/text/12'));
		assert(list.verify('/text/test'));
		assert(!list.verify('/text/4711/details'));
		assert(list.verify('/text/test/details'));
	});

	it ('Should validate wildcards in urls', () => {
		const list = new AuthWhitelist(['/text/*:d', '/text/*:d/details']);
		assert(list.verify('/text/12'));
		assert(!list.verify('/text/test'));
		assert(list.verify('/text/4711/details'));
	});
});
