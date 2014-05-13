module.exports = {
    simple: {
        format: '<bbB',
        parsed: {
            fields: [{
                name: 0,
                type: 'b',
                len: 1
            }, {
                name: 1,
                type: 'b',
                len: 1
            }, {
                name: 2,
                type: 'B',
                len: 1
            }],
            endian: 'little'
        },
        data: [1, 2, 3]
    },
    complex: {
        format: '<bbB{b}5sS{ifc{5b}}',
        parsed: {
            fields: [{
                name: 0,
                type: 'b',
                len: 1
            }, {
                name: 1,
                type: 'b',
                len: 1
            }, {
                name: 2,
                type: 'B',
                len: 1
            }, {
                name: 3,
                fields: [{
                    name: 0,
                    type: 'b',
                    len: 1
                }]
            }, {
                name: 4,
                type: 's',
                len: 5
            }, {
                name: 5,
                type: 'S',
                len: 1
            }, {
                name: 6,
                fields: [{
                    name: 0,
                    type: 'i',
                    len: 1
                }, {
                    name: 1,
                    type: 'f',
                    len: 1
                }, {
                    name: 2,
                    type: 'c',
                    len: 1
                }, {
                    name: 3,
                    fields: [{
                        name: 0,
                        type: 'b',
                        len: 5
                    }]
                }]
            }],
            endian: 'little'
        },
        data: [1, 2, 3, [-1], 'atest', 'somethingelse', [10, 1.899999976158142, 'h', [1, 2, 3, 4, 5]]]
    },
    simpleKeyed: {
        format: '<b(first)b(second)B(third)',
        parsed: {
            fields: [{
                name: 'first',
                type: 'b',
                len: 1
            }, {
                name: 'second',
                type: 'b',
                len: 1
            }, {
                name: 'third',
                type: 'B',
                len: 1
            }],
            endian: 'little'
        },
        data: {
            first: 1,
            second: 2,
            third: 3
        }
    },
    complexKeyed: {
        format: '<b(first)b(second)B(third){b(one)}(obj)5s(other)S(something){i(num)f(flt)c(ch){5b(bytes)}(deeper)}(deep)',
        parsed: {
            fields: [{
                name: 'first',
                type: 'b',
                len: 1
            }, {
                name: 'second',
                type: 'b',
                len: 1
            }, {
                name: 'third',
                type: 'B',
                len: 1
            }, {
                name: 'obj',
                fields: [{
                    name: 'one',
                    type: 'b',
                    len: 1
                }]
            }, {
                name: 'other',
                type: 's',
                len: 5
            }, {
                name: 'something',
                type: 'S',
                len: 1
            }, {
                name: 'deep',
                fields: [{
                    name: 'num',
                    type: 'i',
                    len: 1
                }, {
                    name: 'flt',
                    type: 'f',
                    len: 1
                }, {
                    name: 'ch',
                    type: 'c',
                    len: 1
                }, {
                    name: 'deeper',
                    fields: [{
                        name: 'bytes',
                        type: 'b',
                        len: 5
                    }]
                }]
            }],
            endian: 'little'
        },
        data: {
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
                    bytes: [1, 2, 3, 4, 5]
                }
            }
        }
    },
    simpleMixed: {
        format: '<bb(second)B',
        parsed: {
            fields: [{
                name: 0,
                type: 'b',
                len: 1
            }, {
                name: 'second',
                type: 'b',
                len: 1
            }, {
                name: 2,
                type: 'B',
                len: 1
            }],
            endian: 'little'
        },
        data: {
            '0': 1,
            second: 2,
            '2': 3
        }
    },
    complexMixed: {
        format: '<b(first)b(second)B(third){b}(obj)5s(other)S(something){ifc{5b}}(deep)',
        parsed: {
            fields: [{
                name: 'first',
                type: 'b',
                len: 1
            }, {
                name: 'second',
                type: 'b',
                len: 1
            }, {
                name: 'third',
                type: 'B',
                len: 1
            }, {
                name: 'obj',
                fields: [{
                    name: 0,
                    type: 'b',
                    len: 1
                }]
            }, {
                name: 'other',
                type: 's',
                len: 5
            }, {
                name: 'something',
                type: 'S',
                len: 1
            }, {
                name: 'deep',
                fields: [{
                    name: 0,
                    type: 'i',
                    len: 1
                }, {
                    name: 1,
                    type: 'f',
                    len: 1
                }, {
                    name: 2,
                    type: 'c',
                    len: 1
                }, {
                    name: 3,
                    fields: [{
                        name: 0,
                        type: 'b',
                        len: 5
                    }]
                }]
            }],
            endian: 'little'
        },
        data: {
            first: 1,
            second: 2,
            third: 3,
            other: 'atest',
            something: 'somethingelse',
            obj: [-1],
            deep: [
                10,
                1.899999976158142,
                'h',
                [
                    [1, 2, 3, 4, 5]
                ]
            ]
        }
    },
};
