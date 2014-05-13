require('should');

var bufferpack = require('..');

describe('Keying', function() {
    var values = {
            first: 1,
            second: 2,
            third: 3,
            other: 'atest',
            something: 'somethingelse',
            deep: {
                num: 10,
                flt: 1.567,
                ch: 'h'
            }
        },
        format = '<b(first)b(second)b(third)5s(other)S(something){i(num)f(flt)c(ch)}(deep)',
        packed = bufferpack.pack(format, values);

    describe('#unpack()', function() {
        var unpacked = bufferpack.unpack(format, packed);

        it('should return an object', function() {
            unpacked.should.be.type('object');
            unpacked.should.have.property('first', values.first);
            unpacked.should.have.property('second', values.second);
            unpacked.should.have.property('third', values.third);
            unpacked.should.have.property('other', values.other);
            unpacked.should.have.property('something', values.something);

            unpacked.should.have.property('deep');
            unpacked.deep.should.be.type('object');
            unpacked.deep.should.have.property('num', values.deep.num);
            unpacked.deep.should.have.property('flt');
            unpacked.deep.flt.should.be.approximately(values.deep.flt, 0.0001);
            unpacked.deep.should.have.property('ch', values.deep.ch);
        });

        it('should returned object should have ' + Object.keys(values).length + ' properties', function() {
            Object.keys(unpacked).length.should.equal(Object.keys(values).length);
        });
    });
});