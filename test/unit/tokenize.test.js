require('should');

var nut = require('util'),
    util = require('../../lib/util'),
    data = require('../fixtures/data');

describe('Utils', function () {
    describe('#tokenize', function () {
        it('should parse simple values correctly', function() {
            util.tokenize(data.simple.format).should.eql(data.simple.parsed);
        });

        it('should parse simple keyed values correctly', function() {
            util.tokenize(data.simpleKeyed.format).should.eql(data.simpleKeyed.parsed);
        });

        it('should parse simple mixed values correctly', function() {
            util.tokenize(data.simpleMixed.format).should.eql(data.simpleMixed.parsed);
        });

        it('should parse complex values correctly', function() {
            util.tokenize(data.complex.format).should.eql(data.complex.parsed);
        });

        it('should parse complex keyed values correctly', function() {
            util.tokenize(data.complexKeyed.format).should.eql(data.complexKeyed.parsed);
        });

        it('should parse complex mixed values correctly', function() {
            util.tokenize(data.complexMixed.format).should.eql(data.complexMixed.parsed);
        });
    });
});
