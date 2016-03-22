'use strict'

var co = require('co');

module.exports = function(express) {

	let errorHandle;

	// 返回express
	function coexpress() {
		let app = express()
			// 添加中间件的方式，传递需要自定义的，同时通过装配器模式进行功能追加
		app.addErrorHandle = function(func) {
				errorHandle = func
			}
			//只针对4种框架中用到的方法进行重写
		app.get = wrapAppMethod(app.get)
		app.post = wrapAppMethod(app.post)
		app.delete = wrapAppMethod(app.delete)
		app.put = wrapAppMethod(app.put)
		return app
	}

	function wrapAppMethod(func) {
		return function() {
			return func.apply(this, Array.prototype.slice.call(arguments).map(convertGenerators))
		}
	}

	function convertGenerators(func) {
		return !isGenerator(func) ? func : function(req, res, next) {
			let fn = co.wrap(func)
			return fn(req, res, next).then(function(data) {
				return next()
			}).catch(function(err) {
				if (errorHandle) {
					return errorHandle(err, req, res)
				} else {
					return next(err)
				}

			})
		}
	}

	function isGenerator(func) {
		return typeof func === 'function' && 'GeneratorFunction' === func.constructor.name
	}

	return coexpress
}