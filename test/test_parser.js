/**
 * Dependencies.
 */
var
	cpim = require('../'),
	expect = require('expect.js'),
	fs = require('fs'),
	path = require('path'),


/**
 * Local variables.
 */
	messageFolder = 'messages';


describe('parse messages', function () {

	it('must parse msg1', function () {
		var msg = readMessage('msg1'),
			message = cpim.parse(msg);

		expect(message).to.be.ok();

		console.log('\n>>> message._headers:\n', message._headers);
		console.log('\n>>> message._mimeHeaders:\n', message._mimeHeaders);
		// console.log('\n>>> message.body:\n', message.body);

		expect(message.from().name).to.be('Iñaki Baz Castillo');
		expect(message.from().uri).to.be('sip:ibc@aliax.net');

		expect(message.to().name).to.be('Alice');
		expect(message.to().uri).to.be('sip:alice@atlanta.com');

		expect(message.to(true)).to.eql([
			{
				name: 'Alice',
				uri: 'sip:alice@atlanta.com',
				value: 'Alice <sip:alice@atlanta.com>'
			},
			{
				name: 'Bob',
				uri: 'sip:bob@biloxi.com',
				value: 'Bob <sip:bob@biloxi.com>'
			},
			{
				name: 'Carol',
				uri: 'sip:carol@carolina.com',
				value: 'Carol <sip:carol@carolina.com>'
			}
		]);

		expect(message.dateTime().toISOString()).to.be('2000-12-13T21:40:00.000Z');

		expect(message.subject()).to.be(undefined);
		expect(message.subject(true)).to.empty();

		expect(message.header('urn:cpim:test', 'foo')).to.be('Foo1');
		expect(message.headers('urn:cpim:test', 'foo')).to.eql(['Foo1', 'Foo2', 'Foo3']);

		expect(message.contentType()).to.eql({
			type: 'text',
			subtype: 'xml',
			params: {
				charset: 'utf-8'
			},
			value: 'text/xml; charset=utf-8'
		});

		expect(message.contentId()).to.be('<1234567890@foo.com>');

		expect(message.mimeHeader('content-lalala')).to.be('LALALA');

		expect(message.body.trim()).to.be('<body>\r\nhello\r\n</body>');
	});
});


function readMessage(filename) {
	var filepath = path.join(__dirname, messageFolder, filename),
		msg = fs.readFileSync(filepath, 'utf8');

	return msg.replace(/\n/g, '\r\n');
}
