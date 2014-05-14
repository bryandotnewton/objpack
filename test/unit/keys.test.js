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
                flt: 1.899999976158142,
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
            expect(unpacked).to.eql(values);
        });
    });
});
