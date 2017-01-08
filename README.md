# cocb
`cocb` let you use all your existing asynchronous functions that gets a "callback" in the form of
`function(error, data)` in a sequential way using generators, all this without the need to promisify them.

So if you have a large scale project with lots of non-promised functions and you want to use a
[co](https://www.npmjs.com/package/co) style library - you can use `cocb`.

## Installation
```sh
npm install cocb
```

## Usage
`cocb` is a function in the form: `function(function* (function(Error, Object)))`, meaning:
`cocb` must get a generator function, which gets a `next` function which gets error and data.
So this `next` function should be passed as the `cb` for all your async functions.

`cocb()` will return an object with a `catch` function in the form: `function(function(Error))`, meaning:
the `catch` function should get an error handler function, this error handler will be called
whenever `next()` has been called with an error.

## Example
```js
var cocb = require('cocb');

function getUser(email, cb) {
	setTimeout(() => {
		var data = {email: email, id: Date.now()};
		cb(null, data);
	}, 1000);
}

function getProjects(userId, cb) {
	setTimeout(() => {
		var data = {id: userId, projects: [2, 4, 6]};
		cb(null, data);
	}, 1000);
}

cocb(function* getUserProjects(next) {
	var email = 'Joe@gamil.com';
	console.log('Fetching user:', email);

	var user = yield getUser(email, next);

	console.log('Got user:', user);
	console.log('Fetching projects for user:', user.id);

	var projects = yield getProjects(user.id, next);
	console.log('Got projects:', projects);
}).catch((err) => {
	console.log('Got Error:', err);
});

/*
Output:
Fetching user: Joe@gamil.com
Got user: { email: 'Joe@gamil.com', id: 1483834229291 }
Fetching projects for user: 1483834229291
Got projects: { id: 1483834229291, projects: [ 2, 4, 6 ] }
*/
```

## License
MIT