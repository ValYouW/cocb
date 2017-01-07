var cocb = require('../');

function getUser(email, cb) {
	setTimeout(() => {
		var err;
		// err = new Error('User not found');
		var data = {email: email, id: Date.now()};
		cb(err, data);
	}, 1000);
}

function getProjects(userId, cb) {
	setTimeout(() => {
		var err;
		// err = new Error('Error fetching projects');
		var data = {id: userId, projects: [2, 4, 6]};
		cb(err, data);
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
