describe('schema', function () {

	describe('#string', function () {

		it('simple', function (done) {
			if (!schema.validate({ 'type': 'string'}, 'hello')) {
				throw new Error();
			}
			done();
		});

	});

    describe('#number', function () {

        it('simple', function (done) {
            if (!schema.validate({ 'type': 'number'}, 123.456)) {
                throw new Error();
            }
            done();
        });

    });

    describe('#array', function () {

        it('simple', function (done) {
            if (!schema.validate({ 'type': 'array'}, ['a', 'b', 'c'])) {
                throw new Error();
            }
            done();
        });

        it('empty', function (done) {
            if (!schema.validate({ 'type': 'array'}, [])) {
                throw new Error();
            }
            done();
        });

    });

    describe('#object', function () {

        it('simple', function (done) {
            if (!schema.validate({ 'type': 'object'}, {a: 'one', b: 'two', c: 'three'})) {
                throw new Error();
            }
            done();
        });

        it('empty', function (done) {
            if (!schema.validate({ 'type': 'object'}, {})) {
                throw new Error();
            }
            done();
        });

    });
});