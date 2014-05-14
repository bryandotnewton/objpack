var rgxType = /[AxcbBhHsSfdiIlL]/,
    rgxWhite = /\s/;

module.exports.tokenize = function tokenize(str) {
    var obj = { fields: [] },
        prevVal = '',
        haveTypeInVal = false;

    //iterate each item in string
    for(var i = 0; i < str.length; ++i) {
        var c = str.charAt(i),
            group,
            key = null;

        if(c.match(rgxWhite))
            continue;

        switch(c) {
            //start of string to tokenize (little-endian)
            case '<':
                obj.endian = 'little';
                break;

            //start of string to tokenize (big-endian)
            case '>':
                /* falls through */
            case '!':
                obj.endian = 'big';
                break;

            //start of group to recurse
            case '{':
                //commit prevVal
                if(prevVal) {
                    addField(obj, null, prevVal);
                    prevVal = '';
                    haveTypeInVal = false;
                }

                //parse group
                group = getContainer(str, i, '{', '}');
                i += group.length + 2; //advance past group

                //check for a key
                if(str.charAt(i) === '(') {
                    key = getContainer(str, i, '(', ')');
                    i += key.length + 2; //advance past key
                }

                obj.fields.push({
                    name: key || obj.fields.length,
                    fields: tokenize(group).fields
                });
                key = null;
                i-=1; //let the for loop increment this back
                break;

            //start of a key
            case '(':
                key = getContainer(str, i, '(', ')');
                i += key.length + 1; //advance past key

                addField(obj, key, prevVal);
                prevVal = '';
                haveTypeInVal = false;
                break;

            default:
                //if this is a type
                if(c.match(rgxType)) {
                    //if we already have one then store old as a field and reset
                    if(haveTypeInVal) {
                        addField(obj, null, prevVal);
                        prevVal = '';
                        haveTypeInVal = false
                    }

                    haveTypeInVal = true;
                }

                prevVal += c;
        }
    }

    if(prevVal) {
        addField(obj, null, prevVal);
    }

    if(!obj.endian) {
        obj.endian = 'big';
    }

    return obj;
}

function addField(obj, name, type) {
    var count = 1,
        val = type;

    //has a count
    if(type.length > 1) {
        count = type.match(/\d+/);
        val = type.replace(count, '');

        count = parseInt(count, 10);
    }

    obj.fields.push({
        name: name || obj.fields.length,
        type: val,
        len: count
    });
}

function getContainer(str, start, open, close) {
    var group = '',
        count = 0,
        opened = false;

    for(var i = start; i < str.length; ++i) {
        var c = str.charAt(i);

        if(c === open) {
            count++;

            if(!opened) {
                opened = true;
                continue;
            }
        }

        if(c === close) {
            count--;
        }

        //found end of group
        if(opened && count === 0) {
            return group;
        }
        //inside of a group
        else if(opened) {
            group += c;
        }
    }

    return group;
}
