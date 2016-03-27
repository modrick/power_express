##Express的增强插件
Express的api，以及架构，个人认为比koa更加合理。但是Koa中支持使用Generator来处理异步回调，确实非常的有必要。
所以Power Express插件，就是为了在Express中引入Generator，使得异步编程和异常的处理更加的友好。
Installation
------------
Install the plugin with npm:
```shell
$ npm install power-express --save-dev
```
Basic Usage
-----------
跟express一样的用法，只是后面的函数，可以使用Generator
```javascript
app.get('/', function*(req, res) {
	var result = yield readFile(__dirname + '/test.js')
	return res.send(String(result))
})
```
为统一处理异常，添加一个addErrorHandle方法，如下使用
```javascript
app.addErrorHandle(function(err, req, res) {
	res.json({
		code: 500,
		data: err.toString()
	})
})
```
