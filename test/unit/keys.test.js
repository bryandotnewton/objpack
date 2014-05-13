require('should');

var bufferpack = require('../..');

describe('Keyed Format', function() {
    var values = {
            first: 1,
            second: 2,
            third: 3,
            other: 'atest',
            something: 'somethingelse',
            obj: {
                one: -1
            },
            deep: {
                num: 10,
                flt: 1.567,
                ch: 'h',
                deeper: {
                    bytes: [1,2,3,4,5]
                }
            }
        },
        format = '<b(first)b(second)B(third){b(one)}(obj)5s(other)S(something){i(num)f(flt)c(ch){5b(bytes)}(deeper)}(deep)',
        packed = bufferpack.pack(format, values);

    describe('#unpack()', function() {
        var unpacked = bufferpack.unpack(format, packed);

        it('should return an object with the correct values', function() {
            unpacked.should.be.type('object');
            unpacked.should.have.property('first', values.first);
            unpacked.should.have.property('second', values.second);
            unpacked.should.have.property('third', values.third);
            unpacked.should.have.property('other', values.other);
            unpacked.should.have.property('something', values.something);

            unpacked.should.have.property('obj');
            unpacked.obj.should.be.type('object');
            unpacked.obj.should.have.property('one', values.obj.one);

            unpacked.should.have.property('deep');
            unpacked.deep.should.be.type('object');
            unpacked.deep.should.have.property('num', values.deep.num);
            unpacked.deep.should.have.property('flt');
            unpacked.deep.flt.should.be.approximately(values.deep.flt, 0.0001);
            unpacked.deep.should.have.property('ch', values.deep.ch);

            unpacked.deep.should.have.property('deeper');
            unpacked.deep.deeper.should.be.type('object');
            unpacked.deep.deeper.should.have.property('bytes');
            unpacked.deep.deeper.bytes.should.be.an.Array;
            unpacked.deep.deeper.bytes.length.should.equal(values.deep.deeper.bytes.length);
            unpacked.deep.deeper.bytes.should.eql(values.deep.deeper.bytes);
        });

        it('should returned object should have ' + Object.keys(values).length + ' properties', function() {
            Object.keys(unpacked).length.should.equal(Object.keys(values).length);
        });
    });
});
