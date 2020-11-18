// O(wh) time | O(wh) space
// where w - monitor width and h - monitor height
export default function deadPixels(matrix) {
    const groups = [];
    const m = matrix.length
    const n = matrix[0].length
    const notVisited = new Array(m*n).fill(1)
    const context = { 
        m,
        n,
        visit: (i, j) => notVisited[i*n + j] = 0,
        isNotVisited: (i, j) => notVisited[i*n + j],
        isValidDeadPixel: ([i, j]) => context.isNotVisited(i, j) && matrix[i][j],
    }

    for (let i = 0; i < matrix.length; i++)
        for (let j = 0; j < matrix[i].length; j++)
            if (context.isValidDeadPixel([i, j]))
                groups.push(traverse(context, [i, j], 1))

    return groups.length
}

function traverse(context, [i, j], length) {
    context.visit(i, j)
    const { m, n, isValidDeadPixel } = context

    if (j - 1 >= 0 && isValidDeadPixel([i, j - 1])) length = traverse(context, [i, j - 1], length + 1)
    if (j + 1 < n  && isValidDeadPixel([i, j + 1])) length = traverse(context, [i, j + 1], length + 1)
    if (i - 1 >= 0 && isValidDeadPixel([i - 1, j])) length = traverse(context, [i - 1, j], length + 1)
    if (i + 1 < m  && isValidDeadPixel([i + 1, j])) length = traverse(context, [i + 1, j], length + 1)
    
    return length
}
