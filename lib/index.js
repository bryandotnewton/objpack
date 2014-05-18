var Parser = require('./parser'),
    util = require('./util');

// Unpack the octet array a, beginning at offset p, according to the fmt string
function unpack(fmt, buffer, offset) {
    offset = offset || 0;

    var fmtObj = util.tokenize(fmt),
        parser = new Parser(buffer, fmtObj.endian === 'big'),
        rv = {};

    _unpackFields(parser, fmtObj.fields, offset, rv);

    return rv;
}

function _unpackFields(parser, fields, offset, outObj) {
    var num,
        size,
        field,
        el,
        val;

    for(var i = 0; i < fields.length; ++i) {
        field = fields[i];

        //this is an object field with nested fields
        if(field.fields) {
            if(field.len === 1) {
                offset = _unpackFields(parser, field.fields, offset, (outObj[field.name] = {}));
            } else {
                debugger;
                outObj[field.name] = [];
                for(var x = 0; x < field.len; ++x) {
                    offset = _unpackFields(parser, field.fields, offset, (outObj[field.name][x] = {}));
                }
            }
            continue;
        }

        //normal field value we can unpack
        num = field.len;

        //null term string support
        if(field.type === 'S') {
            num = 0; //deal with empty null term strings
            while(parser.buffer[offset + num] !== 0) {
                num++;
            }

            num++; //one more for null byte
        }

        //get size of field type
        size = Parser.formatLengths[field.type];

        //out of bounds
        if((offset + (num * size)) > parser.buffer.length) {
            return offset;
        }

        el = Parser.formatElements[field.type];

        switch (field.type) {
            case 'A': case 's': case 'S':
                val = parser[el.de](el, offset, num);
                break;
            case 'c': case 'b': case 'B': case 'h': case 'H':
            case 'i': case 'I': case 'l': case 'L': case 'f': case 'd':
                val = parser.unpackSeries(el, num, size, offset);
                if(val.length === 1) {
                    val = val[0];
                }
                break;
        }

        outObj[field.name] = val;

        offset += num * size;
    }

    return offset;
}

// Pack the supplied values into the octet array a, beginning at offset p, according to the fmt string
function packTo(fmt, buffer, offset, values) {
    offset = offset || 0;

    var fmtObj = util.tokenize(fmt),
        parser = new Parser(buffer, fmtObj.endian === 'big');

    _packFields(parser, fmtObj.fields, offset, values);

    return parser.buffer;
}

function _packFields(parser, fields, offset, values) {
    var num,
        size,
        field,
        value,
        el,
        val;

    for(var i = 0; i < fields.length; ++i) {
        field = fields[i];
        value = values[field.name];

        //this is an object field with nested fields
        if(field.fields) {
            offset = _packFields(parser, field.fields, offset, value);
            continue;
        }

        //normal field value we can unpack
        num = field.len;

        //null term string support
        if(field.type === 'S') {
            num = value.length + 1; //add one for null byte
        }

        //get size of field type
        size = Parser.formatLengths[field.type];

        //out of bounds
        if((offset + (num * size)) > parser.buffer.length) {
            return offset;
        }

        el = Parser.formatElements[field.type];

        switch (field.type) {
            case 'A': case 's': case 'S':
                parser[el.en](el, offset, num, value);
                break;
            case 'c': case 'b': case 'B': case 'h': case 'H':
            case 'i': case 'I': case 'l': case 'L': case 'f': case 'd':
                if(!Array.isArray(value)) {
                    value = [value];
                }
                parser.packSeries(el, num, size, offset, value);
                break;
            case 'x':
                for(var j = 0; j < num; ++j) {
                    buffer[offset + j] = 0;
                }
                break;
        }

        offset += num * size;
    }

    return offset;
};

// Pack the supplied values into a new octet array, according to the fmt string
function pack(fmt, values) {
    return packTo(fmt, new Buffer(calcLength(fmt, values)), 0, values);
};

// Determine the number of bytes represented by the format string
function calcLength(fmt, values) {
    var fmtObj = util.tokenize(fmt);

    return _sumFieldLengths(fmtObj.fields, values);
};

function _sumFieldLengths(fields, values) {
    var field,
        value,
        sum = 0;

    for(var i = 0; i < fields.length; ++i) {
        field = fields[i];
        value = values ? values[field.name] : null;

        if(field.fields) {
            sum += _sumFieldLengths(field.fields, value) * field.len;
        } else if(field.type === 'S') {
            sum += value.length + 1; // Add one for null byte
        } else {
            sum += field.len * Parser.formatLengths[field.type];
        }
    }

    return sum;
};

module.exports = {
    unpack: unpack,
    pack: pack,
    packTo: packTo,
    calcLength: calcLength
};
