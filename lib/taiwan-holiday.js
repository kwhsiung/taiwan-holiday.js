const env_conf = require('./config');
const Cache = require('./cache');
const OpendataTW = require('./opendata-tw');

const request = require('request-promise');
const path = require('path');

var engine;

var TaiwanHoliday = {
	/**
	 * config
	 * 	temp_dir: temp directory
	 */
	init: function (ctor_conf) {
		ctor_conf = ctor_conf || {};
		temp_dir = ctor_conf.temp_dir || env_conf.temp_dir || path.resolve(__dirname, '../data');

		this.cache = new Cache(path.resolve(temp_dir, 'taiwan-holiday-cache.json'));
		return this.cache.load()
			.catch(() => {
				var ret;

				return request(OpendataTW.url)
					.then((str) => ret = JSON.parse(str))
					.then((result) => this.cache.save(result))
					.then(() => ret);
			})
			.then((json) => {
				engine = new OpendataTW(json);
			});
	},

	isHoliday: function (date) {
		if (!engine) {
			throw 'need to init first';
		}

		return engine.isHoliday(date);
	}
};

module.exports = TaiwanHoliday;
