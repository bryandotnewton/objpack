var bufferpack = require('../..'),
    Benchmark = new require('benchmark'),
    simple = {
        first: 1,
        second: 2,
        third: 3
    },
    simpleFormat = '<b(first)b(second)B(third)',
    simplePacked = bufferpack.pack(simpleFormat, simple),
    complex = {
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
    complexFormat = '<b(first)b(second)B(third){b(one)}(obj)5s(other)S(something){i(num)f(flt)c(ch){5b(bytes)}(deeper)}(deep)',
    complexPacked = bufferpack.pack(complexFormat, complex);

// Simple Pack
(new Benchmark.Suite())
.add('simple pack', function() {
    bufferpack.pack(simpleFormat, simple);
})
.on('cycle', cycleCallback)
//.on('complete', completeCallback)
.run();

// Simple Unpack
(new Benchmark.Suite())
.add('simple unpack', function() {
    bufferpack.unpack(simpleFormat, simplePacked);
})
.on('cycle', cycleCallback)
//.on('complete', completeCallback)
.run();

// Complex Pack
(new Benchmark.Suite())
.add('complex pack', function() {
    bufferpack.pack(complexFormat, complex);
})
.on('cycle', cycleCallback)
//.on('complete', completeCallback)
.run();

// Complex Unpack
(new Benchmark.Suite())
.add('complex unpack', function() {
    bufferpack.unpack(complexFormat, complexPacked);
})
.on('cycle', cycleCallback)
//.on('complete', completeCallback)
.run();


function cycleCallback(event) {
  console.log(String(event.target));
}

function completeCallback() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
}
