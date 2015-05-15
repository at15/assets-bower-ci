/**
 * Created by Pillar on 2015/5/15.
 */
'use strict';

function trim(str, character) {
    if (character === '' || character === ' ' || character === undefined) {
        return str.trim();
    } else {
        // use regexp to trim
        // TODO, we nee escape all the reserved words
        if (['.', '/'].indexOf(character) !== -1) {
            character = '\\\\' + character;
        }
        var pattern = '^([' + character + ']*)|([' + character + ']*)$';
        return str.replace(new RegExp(pattern, 'g'), '');
    }
}

module.exports = {
    trim: trim
};
