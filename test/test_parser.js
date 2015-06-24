/**
 * Dependencies.
 */
var
	tools = require('./tools'),
	parse = require('../lib/parse'),
	expect = require('expect.js');


describe('Parser', function () {

	it('must parse msg1', function () {
		var
			raw = tools.readFile('msg1'),
			message = parse(raw);

		expect(message).to.be.ok();

		// Parse CPIM headers.

		expect(message.from().name).to.be('Iñaki Baz Castillo');
		expect(message.from().uri).to.be('sip:ibc@aliax.net');

		expect(message.to().name).to.be('Alice');
		expect(message.to().uri).to.be('sip:alice@atlanta.com');

		expect(message.tos()).to.eql([
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

		expect(message.subject()).to.be(undefined);
		expect(message.subjects()).to.empty();

		expect(message.dateTime().toISOString()).to.be('2000-12-13T21:40:00.000Z');

		expect(message.header('urn:cpim:test', 'foo')).to.be('Foo1');
		expect(message.headers('urn:cpim:test', 'foo')).to.eql(['Foo1', 'Foo2', 'Foo3']);
		expect(message.header('urn:cpim:test2', 'foo')).to.be('Bar');

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

		// Get body.

		expect(message.body().trim()).to.be('<body>\r\nhello\r\n</body>');
	});

	it('must parse msg1 and allow later modifications on it', function () {
		var
			raw = tools.readFile('msg1'),
			message = parse(raw),
			date = new Date('Tue Jun 23 2015 13:24:57 GMT+0200 (CEST)');

		expect(message).to.be.ok();

		// Set and parse CPIM headers.

		message.from({
			name: 'IBC œæ€',
			uri: 'im:ibc@aliax.net'
		});

		expect(message.from().name).to.be('IBC œæ€');
		expect(message.from().uri).to.be('im:ibc@aliax.net');
		expect(message.from().value).to.be('IBC œæ€ <im:ibc@aliax.net>');

		message.from(null);

		expect(message.from()).not.to.be.ok();

		message.to({
			uri: 'im:alice@atlanta.com'
		});

		expect(message.to().name).to.be(undefined);
		expect(message.to().uri).to.be('im:alice@atlanta.com');
		expect(message.to().value).to.be('<im:alice@atlanta.com>');

		message.to(null);

		expect(message.to()).not.to.be.ok();

		message.tos([
			{
				name: 'Alice Ω∑©',
				uri: 'im:alice@atlanta.com'
			},
			{
				name: 'Bob å∫∂',
				uri: 'im:bob@biloxi.com'
			}
		]);

		expect(message.tos()).to.eql([
			{
				name: 'Alice Ω∑©',
				uri: 'im:alice@atlanta.com',
				value: 'Alice Ω∑© <im:alice@atlanta.com>'
			},
			{
				name: 'Bob å∫∂',
				uri: 'im:bob@biloxi.com',
				value: 'Bob å∫∂ <im:bob@biloxi.com>'
			}
		]);

		message.subject('New Subject!!!');

		expect(message.subject()).to.be('New Subject!!!');

		message.subject(null);

		expect(message.subject()).not.to.be.ok();

		message.subjects([
			'subject 1',
			'subject 2'
		]);

		expect(message.subjects()).to.eql([
			'subject 1',
			'subject 2'
		]);

		message.dateTime(date);

		expect(message.dateTime().toISOString()).to.be(date.toISOString());

		message.dateTime(null);

		expect(message.dateTime()).not.to.be.ok();

		message.header('urn:cpim:test3', 'baz', 'BAZ');

		expect(message.header('urn:cpim:test3', 'baz')).to.be('BAZ');

		message.header('urn:cpim:test3', 'baz', null);

		expect(message.header('urn:cpim:test3', 'baz')).not.to.be.ok();

		message.headers('urn:cpim:test4', 'qwerty', ['QWE', 'ASD']);

		expect(message.headers('urn:cpim:test4', 'qwerty')).to.eql(['QWE', 'ASD']);

		message.contentType({
			type: 'text',
			subtype: 'plain',
			params: {
				charset: 'utf-16'
			}
		});

		expect(message.contentType()).to.eql({
			type: 'text',
			subtype: 'plain',
			params: {
				charset: 'utf-16'
			},
			value: 'text/plain;charset=utf-16'
		});

		message.contentType(null);

		expect(message.contentType()).not.to.be.ok();

		message.contentId('<qwerty>');

		expect(message.contentId()).to.be('<qwerty>');

		message.contentId(null);

		expect(message.contentId()).not.to.be.ok();

		message.mimeHeader('content-foo', 'FOO');

		expect(message.mimeHeader('content-foo')).to.be('FOO');

		message.mimeHeader('content-foo', null);

		expect(message.mimeHeader('content-foo')).not.to.be.ok();

		// Set and get the body.

		message.body('HI');

		expect(message.body()).to.be('HI');

		message.body(null);

		expect(message.body()).not.to.be.ok();
	});

	it('must fail parsing msg2 due to lack of MIME fields', function () {
		var
			raw = tools.readFile('msg2'),
			message = parse(raw);

		expect(message).not.to.be.ok();
	});

	it('must fail parsing msg3 due to undeclared NS prefix', function () {
		var
			raw = tools.readFile('msg3'),
			message = parse(raw);

		expect(message).not.to.be.ok();
	});

});
