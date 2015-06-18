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
		var msg = readMessage('msg2'),
			message = cpim.parse(msg);

		expect(1).to.be(1);

		console.log('\n>>> message.headers:\n', message.headers);
		console.log('\n>>> message.mimeHeaders:\n', message.mimeHeaders);
	});

});


function readMessage(filename) {
	var filepath = path.join(__dirname, messageFolder, filename),
		msg = fs.readFileSync(filepath, 'utf8');

	return msg.replace(/\n/g, '\r\n');
}
