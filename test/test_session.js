/**
 * Dependencies.
 */
var
	tools = require('./tools'),
	Session = require('../lib/Session'),
	expect = require('expect.js');


describe('Session', function () {
	var
		session = new Session(),
		raw1 = tools.readFile('msg1'),
		parsedMessage;

	it('must emit "received" when receive() is called with a valid raw message', function (done) {
		session.on('received', function (message) {
			// Store it for later usage.
			parsedMessage = message;

			expect(message.isValid()).to.be.ok();
			expect(message.from().name).to.be('Iñaki Baz Castillo');

			done();
		});

		session.receive(raw1);
	});

	it('must emit "send" when send() is called with a valid Message', function (done) {
		session.on('send', function (message) {
			expect(message.isValid()).to.be.ok();
			expect(message.from().name).to.be('Iñaki Baz Castillo');

			done();
		});

		session.send(parsedMessage);
	});

});
