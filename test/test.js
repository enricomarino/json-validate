describe('schema', function () {

	describe('#string', function () {
		
		it('simple', function (done) {
			if (!schema.validate({ 'type': 'string'}, 'hello')) {
				throw new Error();
			}
			done();
		});

	});

});