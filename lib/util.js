module.exports.tokenize = function tokenize(str) {
    var obj = { fields: [] },
        prevVal = '';

    //iterate each item in string
    for(var i = 0; i < str.length; ++i) {
        var c = str.charAt(i),
            group, key,
            count = 1;

        switch(c) {
            //start of string to tokenize (little-endian)
            case '<':
                obj.endian = 'little';
                break;

            //start of string to tokenize (big-endian)
            case '>':
                obj.endian = 'big';
                break;

            //start of group to recurse
            case '{':
                group = getContainer(str, i, '{', '}');
                i += group.length + 1; //advance past group
                key = getContainer(str, i, '(', ')');
                i += key.length + 2; //advance past key

                obj.fields.push({
                    name: key,
                    fields: tokenize(group).fields
                });
                break;

            //start of a key
            case '(':
                key = getContainer(str, i, '(', ')');
                i += key.length + 1; //advance past key

                //has a count
                if(prevVal.length > 1) {
                    count = prevVal.match(/\d+/);
                    prevVal = prevVal.replace(count, '');

                    count = parseInt(count, 10);
                }

                obj.fields.push({
                    name: key,
                    type: prevVal,
                    count: count
                });
                prevVal = '';
                count = 1;
                break;

            default:
                prevVal += c;
        }
    }

    return obj;
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