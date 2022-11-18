/**  componentIndex.js
 *
 * @module componentIndex
 * @classdesc
 *   Indexing scheme.
 *
 * @since 1.0
 */

(function componentIndex (global) {
    'use strict';

    /* ----------------------------------------------------------------------------------
     * Properties and function put on the componentIndex object are exposed as public,
     * other vars are private.
     * ----------------------------------------------------------------------------------*/

    var componentIndex = {
            version: '1.0.0'
        },
        _table = null;

    /**
     * Private function to setup the lookup table.
     * @param columns int - number of columns, must be greater than 1.
     * @param rows int - number of rows, if less than 2 will be set to the number of columns
     * @returns {boolean} - true if table created.
     */
    function _createTable (columns, rows) {
        var isValid = false,
            row,
            column,
            id,
            above,
            right,
            below,
            left;

        if (columns < 2) {
            columns = 4;
        }
        if (rows < 2) {
            rows = columns;
        }
        _table = [];
        id = 1;
        for (column = 0; column < columns; column ++) {
            for (row = 0; row < rows; row ++) {
                above = row == 0 ? 0 : (id - columns);
                right = column == (columns - 1) ? 0 : (id + 1);
                below = row == (rows - 1) ? 0 : (id + columns);
                left = column == 0 ? 0 : (id - 1);
                _table[id] = {
                    id: id,
                    column: column,
                    row: row,
                    locked: false,
                    neighbors: [above, right, below, left],
                    content: {}
                };
                id ++;
            }
        }
        return isValid;
    }

    /* ----------------------------------------------------------------------------------
     * Functions put on the componentIndex object are exposed as public
     * ----------------------------------------------------------------------------------*/

    componentIndex.initialize = function (columns, rows) {
        var isValid = _createTable(columns, rows);
        return isValid;
    };

    componentIndex.lock = function(id) {
        var object = _table[id],
            isLocked = false;

        if (object != null) {
            object.locked = true;
            isLocked = true;
        }
        return isLocked;
    };

    componentIndex.unlock = function(id) {
        var object = _table[id],
            isLocked = false;

        if (object != null) {
            object.locked = false;
            isLocked = false;
        }
        return isLocked;
    };

    componentIndex.isLocked = function(id) {
        var object = _table[id],
            isLocked = false;

        if (object != null) {
            isLocked = object.locked;
        }
        return isLocked;
    };

    componentIndex.allLocked = function() {
        var allLocked = true,
            countOfObjects = _table.length(),
            id = 1;

        while (allLocked && id <= countOfObjects) {
            allLocked = _table[id].locked;
            id ++;
        }
        return allLocked;
    };

    /**
     * Determine if two items are adjacent.
     * @param {integer} id Index of an item to check.
     * @param {integer} otherId Index of second item to check.
     * @returns {boolean} `true` if the two items are adjacent, otherwise `false`.
     */
    componentIndex.isAdjacent = function(id, otherId) {
        var object = _table[id],
            adjacentOnSide = 0;

        if (object != null) {
            adjacentOnSide = object.neighbors.indexOf(otherId) + 1;
        }
        return adjacentOnSide;
    };

    /**
     * Given a list of item ids, join them together by setting the `locked` property on each.
     * @param {Array} idList A lists of ids to join together.
     * @returns {integer} A count of the number of items locked.
     */
    componentIndex.join = function(idList) {
        // if ...args
        // else if array
    }

    /* ----------------------------------------------------------------------------------
     * Setup for AMD, node, or standalone reference the commonUtilities object.
     * ----------------------------------------------------------------------------------*/

    if (typeof define === 'function' && define.amd) {
        define(function () { return componentIndex; });
    } else if (typeof exports === 'object') {
        module.exports = componentIndex;
    } else {
        var existingGlobalFunctions = global.componentIndex;
        componentIndex.existingGlobalFunctions = function () {
            global.componentIndex = existingGlobalFunctions;
            return this;
        };
        global.componentIndex = componentIndex;
    }
})(this);
