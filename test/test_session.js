/**
 * Dependencies.
 */
var
	cpim = require('../'),
	expect = require('expect.js');


describe('Session', function () {

	var
		session = new cpim.Session({
			from: {name: 'Alice', uri: 'im:alice@atlanta.com'},
			to: {name: 'Bob', uri: 'im:bob@biloxi.com'},
			contentType: {type: 'text', subtype: 'plain'}
		}),
		message = new cpim.Message();


	it('must emit "send" when send() is called with a valid Message', function (done) {
		session.on('send', function () {
			done();
		});

		session.send(message);
	});

	it('must add default From, To, Content-Type and DateTime to the outgoing message', function () {
		expect(message.isValid()).to.be.ok();
		expect(message.from().name).to.be('Alice');
		expect(message.to().name).to.be('Bob');
		expect(message.contentType()).to.be.ok();
		expect(message.dateTime()).to.be.ok();
	});

	it('must emit "received" when receive() is called with a valid raw message', function (done) {
		session.on('received', function () {
			done();
		});

		session.receive(message.toString());
	});

});
