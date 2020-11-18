import deadPixels from './deadPixels.js'
import findSum from './findSum.js'

const myExpect = (a, b) => expect(a).toBe(b)

test(
    `1. Having a non-empty array of non-negative integers of length N, you need to return the maximum sum of subset of array elements such that you never take any two adjacent elements.`,
    () => {
        myExpect(findSum([1, 2, 3, 1]) /*?*/, 4) //?. $
        myExpect(findSum([2, 7, 9, 3, 1]) /*?*/, 12) //?. $
        // [0, 0, 0, 0]
        // 1
        //  X
        // [5, 0, 0, 0]
        //  x  X
        // [5, 1, 0, 0]
        //  x  x  X
        // [5, 1, 2+5, 0]
        //  x  x  x  X
        // [5, 1, 7, 5+1 OR 7]
        // 2
        // [5, 1, 7, 7]
        //  X
        // [5 OR 5, 0, 0, 0]
        //  x  X
        // [5, 1 OR 1, 0, 0]
        //  x  x  X
        // [5, 1, 2 OR 7, 0]
        //  x  x  x  X
        // [5, 1, 7, 5+5 OR 7]
        myExpect(findSum([5, 1, 2, 5]) /*?*/, 10) //?. $
        // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        // 1
        //  X
        // [7, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        //  x  X
        // [7, 3, 0, 0, 0, 0, 0, 0, 0, 0]
        //  x  x  X
        // [7, 3, 3+7=10, 0, 0, 0, 0, 0, 0, 0]
        //  x  x  x  X
        // [7, 3,10, 7+3=10, 0, 0, 0, 0, 0, 0]
        //  x  x  x  x  X
        // [7, 3,10,10, 4+10=14, 0, 0, 0, 0, 0]
        //  x  x  x  x  x  X
        // [7, 3,10,10,14, 7+10=17, 0, 0, 0, 0]
        //  x  x  x  x  x  x  X
        // [7, 3,10,10,14,17, 2+14=16, 0, 0, 0]
        //  x  x  x  x  x  x  x  X
        // [7, 3,10,10,14,17,16, 2+17=19, 0, 0]
        //  x  x  x  x  x  x  x  x  X
        // [7, 3,10,10,14,17,16,19, 2+16=18, 0]
        //  x  x  x  x  x  x  x  x  x  X
        // [7, 3,10,10,14,17,16,19,18, 7+19=26]
        // 2
        // [7, 3,10,10,14,17,16,19,18,26]
        //  x  x  x  X
        // [7, 3,10, 7+7 OR 10, 0, 0, 0, 0, 0, 0]
        //  x  x  x  x  X
        // [7, 3,10,14, 4+3 OR 14, 0, 0, 0, 0, 0]
        //  x  x  x  x  x  X
        // [7, 3,10,14,14, 7+max(14,14) OR 17, 0, 0, 0, 0]
        //  x  x  x  x  x  x  X
        // [7, 3,10,14,14,21, 2+max(14,14) OR 16, 0, 0, 0]
        //  x  x  x  x  x  x  x  X
        // [7, 3,10,14,14,21,16, 2+max(21,14) OR 19, 0, 0]
        //  x  x  x  x  x  x  x  x  X
        // [7, 3,10,14,14,21,16,23, 2+max(21,16) OR 18, 0]
        //  x  x  x  x  x  x  x  x  x  X
        // [7, 3,10,14,14,21,16,23,23, 7+max(23,16) OR 26]
        myExpect(findSum([7, 3, 3, 7, 4, 7, 2, 2, 2, 7]) /*?*/, 30) //?. $
        myExpect(findSum([100, 1, 1, 2, 1, 100]) /*?*/, 202) //?. $
    },
)

test(
    `2. You have a map of the monitor's pixels where good pixels are marked with '0' and dead pixels are marked with '1'.
Write a code that returns the number of dead pixel groups. 
A group is surrounded by good pixels (or monitor edges) and is formed by connecting adjacent dead pixels horizontally or vertically (NOT diagonally).
A group may consist of a single pixel if it satisfies the above condition.`,
    () => {
        myExpect(deadPixels([
            [0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
        ]) /*?*/, 2) //?.s $
        myExpect(deadPixels([
            [0, 1, 0, 1, 1],
            [1, 1, 1, 0, 0],
            [1, 1, 0, 0, 1],
            [1, 0, 1, 1, 1],
            [1, 1, 1, 0, 0],
        ]) /*?*/, 2) //?.s $
        myExpect(deadPixels([
            [1, 0, 0, 0, 0, 0, 1],
            [0, 1, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0],
            [0, 0, 1, 0, 1, 0, 0],
            [0, 1, 0, 0, 0, 1, 0],
            [1, 0, 0, 0, 0, 0, 1]
        ]) /*?*/, 9) //?.s $
    },
)