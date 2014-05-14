require('should');

var nut = require('util'),
    util = require('../../lib/util'),
    data = require('../fixtures/data');

describe('Utils', function () {
    describe('#tokenize', function () {
        it('should parse simple values correctly', function() {
            expect(util.tokenize(data.simple.format)).to.eql(data.simple.parsed);
        });

        it('should parse simple keyed values correctly', function() {
            expect(util.tokenize(data.simpleKeyed.format)).to.eql(data.simpleKeyed.parsed);
        });

        it('should parse simple mixed values correctly', function() {
            expect(util.tokenize(data.simpleMixed.format)).to.eql(data.simpleMixed.parsed);
        });

        it('should parse complex values correctly', function() {
            expect(util.tokenize(data.complex.format)).to.eql(data.complex.parsed);
        });

        it('should parse complex keyed values correctly', function() {
            expect(util.tokenize(data.complexKeyed.format)).to.eql(data.complexKeyed.parsed);
        });

        it('should parse complex mixed values correctly', function() {
            expect(util.tokenize(data.complexMixed.format)).to.eql(data.complexMixed.parsed);
        });

        it('should parse whitespace values correctly', function() {
            expect(util.tokenize(data.whitespace.format)).to.eql(data.whitespace.parsed);
        });
    });
});
