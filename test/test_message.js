var
	/**
	 * Dependencies.
	 */
	cpim = require('../'),
	expect = require('expect.js'),

	/**
	 * Constants.
	 */
	PRINTED =
					'From: Iñaki Baz Castillo <im:inaki.baz@eface2face.com>\r\n' +
					'To: Alicia <im:alicia@atlanta.com>\r\n' +
					'Subject: Urgent, read pliz pliz\r\n' +
					'\r\n' +
					'Content-Type: text/plain\r\n' +
					'Content-Length: 5\r\n' +
					'\r\n' +
					'HELLO',

	/**
	 * Local variables.
	 */
	message;


describe('Message', function () {

	it('must create a message via cpim.factory()', function () {
		message = cpim.factory({
			from: {
				name: 'Iñaki Baz Castillo',
				uri: 'im:inaki.baz@eface2face.com'
			},
			to: {
				name: 'Alicia',
				uri: 'im:alicia@atlanta.com'
			},
			dateTime: false,
			body: 'HELLO'
		});

		// Verify field values.

		expect(message.from().name).to.be('Iñaki Baz Castillo');
		expect(message.from().uri).to.be('im:inaki.baz@eface2face.com');

		expect(message.to().name).to.be('Alicia');
		expect(message.to().uri).to.be('im:alicia@atlanta.com');

		expect(message.dateTime()).to.be(undefined);

		expect(message.body()).to.be('HELLO');
	});

	it('must extend the message via Message API', function () {
		// Set message fields.

		message.subject('Urgent, read pliz pliz');

		message.contentType({
			type: 'text',
			subtype: 'plain'
		});

		message.mimeHeader('Content-Length', '5');

		// Verify field values.

		expect(message.subject()).to.be('Urgent, read pliz pliz');

		expect(message.contentType()).to.eql({
			type: 'text',
			subtype: 'plain',
			value: 'text/plain'
		});

		expect(message.mimeHeader('Content-Length')).to.be('5');
	});

	it('resulting message must match the expected one', function () {
		// Verify printed message.
		expect(message.toString()).to.be(PRINTED);

		// Verify is a valid message.
		expect(message.isValid()).to.be.ok();
	});

});
