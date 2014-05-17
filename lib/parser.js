function Parser(buffer, bigendian) {
    this.buffer = buffer;
    this.bigendian = !!bigendian;
}

module.exports = Parser;

// Raw byte arrays
Parser.prototype.deArray = function(el, offset, len) {
    if(buffer typeof Uint8Array) {
        return [this.buffer.subarray(offset, offset + len)];
    } else {
        return [this.buffer.slice(offset, offset + len)];
    }
};
Parser.prototype.enArray = function(el, offset, len, values) {
    for (var i = 0; i < len; ++i) {
        this.buffer[offset + i] = values[i] ? values[i] : 0;
    }
};

// ASCII character strings
Parser.prototype.deString = function(el, offset, len) {
    var rv = new Array(len);

    for (var i = 0; i < len; ++i) {
        rv[i] = String.fromCharCode(this.buffer[offset + (this.bigendian ? i : len - i - 1)]);
    }

    return rv.join('');
};
Parser.prototype.enString = function(el, offset, len, value) {
    var t;

    for (var i = 0; i < len; ++i) {
        this.buffer[offset + (this.bigendian ? i : len - i - 1)] = (t = value.charCodeAt(i)) ? t : 0;
    }
};

// ASCII character strings null terminated
Parser.prototype.denullString = function(el, offset, len, value) {
    var str = this.deString(el, offset, len, value);

    return str.substring(0, str.length - 1);
};

// ASCII characters
Parser.prototype.deChar = function(el, offset) {
    return String.fromCharCode(this.buffer[offset]);
};
Parser.prototype.enChar = function(el, offset, value) {
    this.buffer[offset] = value.charCodeAt(0);
};

// Little-endian (un)signed N-byte integers
Parser.prototype.deInt = function(el, offset) {
    var lsb = this.bigendian ? (el.len - 1) : 0,
        nsb = this.bigendian ? -1 : 1,
        stop = lsb + nsb * el.len,
        rv = 0,
        f = 1;

    for (var i = lsb; i != stop; i += nsb) {
        rv += this.buffer[offset + i] * f;
        f *= 256;
    }

    if (el.signed && (rv & Math.pow(2, el.len * 8 - 1))) {
        rv -= Math.pow(2, el.len * 8);
    }

    return rv;
};
Parser.prototype.enInt = function(el, offset, value) {
    var lsb = this.bigendian ? (el.len - 1) : 0,
        nsb = this.bigendian ? -1 : 1,
        stop = lsb + nsb * el.len;

    value = Math.min(Math.max(value, el.min), el.max);

    for (var i = lsb; i != stop; i += nsb) {
        this.buffer[offset + i] = value & 0xff;
        value >>= 8;
    }
};

// Little-endian N-bit IEEE 754 floating point
Parser.prototype.de754 = function(el, offset) {
    var s, e, m, i, d, nBits, mLen, eLen, eBias, eMax;
    mLen = el.mLen, eLen = el.len * 8 - el.mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1;

    i = this.bigendian ? 0 : (el.len - 1);
    d = this.bigendian ? 1 : -1;
    s = this.buffer[offset + i];
    i += d;
    nBits = -7;
    for (e = s & ((1 << (-nBits)) - 1), s >>= (-nBits), nBits += eLen; nBits > 0; e = e * 256 + this.buffer[offset + i], i += d, nBits -= 8);
    for (m = e & ((1 << (-nBits)) - 1), e >>= (-nBits), nBits += mLen; nBits > 0; m = m * 256 + this.buffer[offset + i], i += d, nBits -= 8);

    switch (e) {
        case 0:
            // Zero, or denormalized number
            e = 1 - eBias;
            break;
        case eMax:
            // NaN, or +/-Infinity
            return m ? NaN : ((s ? -1 : 1) * Infinity);
        default:
            // Normalized number
            m = m + Math.pow(2, mLen);
            e = e - eBias;
            break;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};
Parser.prototype.en754 = function(el, offset, values) {
    var s, e, m, i, d, c, mLen, eLen, eBias, eMax;
    mLen = el.mLen, eLen = el.len * 8 - el.mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1;

    s = values < 0 ? 1 : 0;
    values = Math.abs(values);
    if (isNaN(values) || (values == Infinity)) {
        m = isNaN(values) ? 1 : 0;
        e = eMax;
    } else {
        e = Math.floor(Math.log(values) / Math.LN2); // Calculate log2 of the value

        if (values * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2; // Math.log() isn't 100% reliable
        }

        // Round by adding 1/2 the significand's LSD
        if (e + eBias >= 1) {
            values += el.rt / c; // Normalized:  mLen significand digits
        } else {
            values += el.rt * Math.pow(2, 1 - eBias); // denormalized:  <= mLen significand digits
        }

        if (values * c >= 2) {
            e++;
            c /= 2; // Rounding can increment the exponent
        }

        if (e + eBias >= eMax) {
            // Overflow
            m = 0;
            e = eMax;
        } else if (e + eBias >= 1) {
            // Normalized - term order matters, as Math.pow(2, 52-e) and values*Math.pow(2, 52) can overflow
            m = (values * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
        } else {
            // denormalized - also catches the '0' case, somewhat by chance
            m = values * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
        }
    }

    for (i = this.bigendian ? (el.len - 1) : 0, d = this.bigendian ? -1 : 1; mLen >= 8; this.buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);
    for (e = (e << mLen) | m, eLen += mLen; eLen > 0; this.buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);
    this.buffer[offset + i - d] |= s * 128;
};

// Unpack a series of num elements of size from buffer at offset
Parser.prototype.unpackSeries = function(el, num, size, offset) {
    var rv = [];

    for (var i = 0; i < num; ++i) {
        rv.push(this[el.de](el, offset + i * size));
    }

    return rv;
};

// Pack a series of num elements of size from array values to buffer at offset
Parser.prototype.packSeries = function(el, num, size, offset, values) {
    for (var o = 0; o < num; ++o) {
        this[el.en](el, offset + o * size, values[o]);
    }
};

// Class data
Parser.sPattern = '(\\d+)?([AxcbBhHsSfdiIlL])(\\(([a-zA-Z0-9]+)\\))?';
Parser.formatLengths = {
    'A': 1,
    'x': 1,
    'c': 1,
    'b': 1,
    'B': 1,
    'h': 2,
    'H': 2,
    's': 1,
    'S': 1,
    'f': 4,
    'd': 8,
    'i': 4,
    'I': 4,
    'l': 4,
    'L': 4
};

Parser.formatElements = {
    'A': {
        en: 'enArray',
        de: 'deArray'
    },
    's': {
        en: 'enString',
        de: 'deString'
    },
    'S': {
        en: 'enString',
        de: 'denullString'
    },
    'c': {
        en: 'enChar',
        de: 'deChar'
    },
    'b': {
        en: 'enInt',
        de: 'deInt',
        len: 1,
        signed: true,
        min: -Math.pow(2, 7),
        max: Math.pow(2, 7) - 1
    },
    'B': {
        en: 'enInt',
        de: 'deInt',
        len: 1,
        signed: false,
        min: 0,
        max: Math.pow(2, 8) - 1
    },
    'h': {
        en: 'enInt',
        de: 'deInt',
        len: 2,
        signed: true,
        min: -Math.pow(2, 15),
        max: Math.pow(2, 15) - 1
    },
    'H': {
        en: 'enInt',
        de: 'deInt',
        len: 2,
        signed: false,
        min: 0,
        max: Math.pow(2, 16) - 1
    },
    'i': {
        en: 'enInt',
        de: 'deInt',
        len: 4,
        signed: true,
        min: -Math.pow(2, 31),
        max: Math.pow(2, 31) - 1
    },
    'I': {
        en: 'enInt',
        de: 'deInt',
        len: 4,
        signed: false,
        min: 0,
        max: Math.pow(2, 32) - 1
    },
    'l': {
        en: 'enInt',
        de: 'deInt',
        len: 4,
        signed: true,
        min: -Math.pow(2, 31),
        max: Math.pow(2, 31) - 1
    },
    'L': {
        en: 'enInt',
        de: 'deInt',
        len: 4,
        signed: false,
        min: 0,
        max: Math.pow(2, 32) - 1
    },
    'f': {
        en: 'en754',
        de: 'de754',
        len: 4,
        mLen: 23,
        rt: Math.pow(2, -24) - Math.pow(2, -77)
    },
    'd': {
        en: 'en754',
        de: 'de754',
        len: 8,
        mLen: 52,
        rt: 0
    }
};
