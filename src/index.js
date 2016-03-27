'use strict'

var co = require('co');

module.exports = function(express) {

	let errorHandle;

	// 返回express对象
	function coexpress() {
		let app = express()
			// 以添加错误处理函数，对业务层的错误异常进行自定义处理
		app.addErrorHandle = function(func) {
				errorHandle = func
		}
			//只针对部分框架中用到的方法进行重写
		app.get = wrapAppMethod(app.get)
		app.post = wrapAppMethod(app.post)
		app.delete = wrapAppMethod(app.delete)
		app.put = wrapAppMethod(app.put)
		app.use = wrapAppMethod(app.use)
		app.all = wrapAppMethod(app.use)
		app.param = wrapAppMethod(app.param)
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
		    fn(req, res, next).then(function(data) {
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