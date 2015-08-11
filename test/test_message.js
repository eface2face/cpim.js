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
					'DateTime: 2000-12-13T21:40:00.000Z\r\n' +
					'\r\n' +
					'Content-Type: text/plain ;charset=utf-8\r\n' +
					'Content-Length: 5\r\n' +
					'\r\n' +
					'HELLO',

	/**
	 * Local variables.
	 */
	message, mime;


describe('Message', function () {

	it('must create a message via cpim.factory()', function () {
		mime = cpim.mimemessage.factory({
			contentType: 'text/plain ;charset=utf-8',
			body: 'HELLO'
		});
		mime.header('Content-Length', '5');

		message = cpim.factory({
			from: 'Iñaki Baz Castillo <im:inaki.baz@eface2face.com>',
			to: 'Alicia <im:alicia@atlanta.com>',
			dateTime: false,
			mime: mime
		});

		expect(message.from().name).to.be('Iñaki Baz Castillo');
		expect(message.from().uri).to.be('im:inaki.baz@eface2face.com');
		expect(message.to().name).to.be('Alicia');
		expect(message.to().uri).to.be('im:alicia@atlanta.com');
		expect(message.dateTime()).to.be(undefined);

		expect(message.mime.contentType().type).to.eql('text');
		expect(message.mime.contentType().subtype).to.eql('plain');
		expect(message.mime.contentType().fulltype).to.eql('text/plain');
		expect(message.mime.contentType().params).to.eql({
			charset: 'utf-8'
		});
		expect(message.mime.body).to.be('HELLO');
	});

	it('must extend the message via Message API', function () {
		message.subject('Urgent, read pliz pliz');
		message.dateTime(new Date('2000-12-13T21:40:00.000Z'));

		expect(message.subject()).to.be('Urgent, read pliz pliz');
		expect(message.dateTime().toISOString()).to.be('2000-12-13T21:40:00.000Z');
	});

	it('resulting message must match the expected one', function () {
		expect(message.toString()).to.be(PRINTED);
	});

});
