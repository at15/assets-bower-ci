/**
 * Created by Pillar on 2015/5/15.
 */
'use strict';

function trim(str, character) {
    console.log(str, character);
    if (character === '' || character === ' ' || character === undefined) {
        throw new Error('aaaa!');
        //return str.trim();
    } else {
        // use regexp to trim
        // todo, we nee escape
        if (['.', '/'].indexOf(character) !== -1) {
            character = '\\\\' + character;
        }
        //var pattern = '^([' + character + ']*)|([' + character + ']*)$';
        //var pattern = '^([\\.]*)|([\\.]*)$';
        //return str.replace(new RegExp(pattern, 'g'), '');
        //console.log('..123..'.replace(/^([\.]*)|([\.]*)$/g, ''));
        var re = str.replace(/^([\.]*)|([\.]*)$/g, '');
        console.log('after trim is', re);

        //return re;
        throw new Error('aaaa!');
    }
}

module.exports = {
    trim: trim
};
