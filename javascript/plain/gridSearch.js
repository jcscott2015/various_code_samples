'use strict';

/**
 * Grid Search
 *
 * You've been given a grid of dimensions M x N. This grid is special though.
 * There are some rules for numbers in this grid.
 *
 * <ul>
 *   <li><code>grid[i][j] > grid[i][j-1]</code> for <code>0 < j < N-1 </code></li>
 *   <li><code>grid[i][j] > grid[i-1][j]</code> for <code>0 < i < M-1 </code></li>
 * </ul>
 *
 * <p>You must find if a given number exists in this grid at all.</p>
 * <p>Oh, and this grid can be really huge, so optimize your execution speed.</p>
 * @author rahulsomasunderam
 * @since 3/20/15
 */

var gridSearch = function(grid, number) {
    /*
     TODO 1: Implement this function
     Be careful of test timeouts. All tests have a timeout which fails your test if your
     implementation is too slow.
   */

    // Start at bottom left of grid.
    // Calling another recursion function here is a bit faster
    // than recursing gridSearch() with added x and y arguments.
    return seekNum(grid, number, (grid.length - 1), 0);
};

/**
 * seekNum
 * Recursive Saddleback Search function to search for
 * the first existence of a number in a matrix.
 * @param  {obj} g    [2D matrix]
 * @param  {int} n    [number to find]
 * @param  {int} x    [row coordinate]
 * @param  {int} y    [column coordinate]
 * @return {bool}     [found or not]
 * @author John C. Scott
 * @since 05/11/2017
 */
var seekNum = function(g, n, x, y) {
    var xL = g.length;
    var yL = g[xL - 1].length;

    if (((x > -1) && (x < xL)) && ((y > -1) && (y < yL))) {
        var v = g[x][y];
        if (n == v) {
            return true;
        } else if (n > v) {
            return seekNum(g, n, x, y + 1);
        } else {
            return seekNum(g, n, x - 1, y);
        }
    }
    return false;
};