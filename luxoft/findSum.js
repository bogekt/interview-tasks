// O(n) time | O(n) space, can be reduced to O(1)
// where n - array size
export default function findSum(array) {
	if (!array || !array.length) return 0

	const sums = new Array(array.length).fill(0)

	let maxThusFar = 0
	for (let i = 0; i < array.length; i++)
		maxThusFar = Math.max(
			maxThusFar,
			sums[i] = Math.max(
				array[i] + Math.max(
					i - 2 >= 0 ? sums[i - 2] : 0,
					i - 3 >= 0 ? sums[i - 3] : 0,
				),
			)
		)

	return maxThusFar
}
