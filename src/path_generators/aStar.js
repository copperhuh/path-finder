import PriorityQueue from "js-priority-queue";

export default function* aStar(nodes, cols, startPos, targetPos, instant) {
	let path;
	let els = [];

	for (let i = 0; i < nodes.length; i++) {
		if (
			nodes[i] === "wall" ||
			nodes[i] === "start" ||
			nodes[i] === "target"
		) {
			els.push({ status: nodes[i], index: i, neighbors: [] });
		} else {
			els.push({ status: "empty", index: i, neighbors: [] });
		}
	}
	for (let one of els) {
		if (one.status === "wall") continue;

		let tempNeighbors = [];
		if (
			one.index % cols !== cols - 1 &&
			els[one.index + 1].status !== "wall"
		) {
			tempNeighbors.push(one.index + 1);
		}
		if (one.index % cols !== 0 && els[one.index - 1].status !== "wall") {
			tempNeighbors.push(one.index - 1);
		}
		if (
			one.index + cols < nodes.length &&
			els[one.index + cols].status !== "wall"
		) {
			tempNeighbors.push(one.index + cols);
		}
		if (one.index - cols >= 0 && els[one.index - cols].status !== "wall") {
			tempNeighbors.push(one.index - cols);
		}
		one.neighbors = tempNeighbors;
	}

	const targetX = targetPos % cols;
	const targetY = Math.floor(targetPos / cols);

	const h = (start) => {
		const startX = start % cols;
		const startY = Math.floor(start / cols);

		return Math.abs(startX - targetX) + Math.abs(startY - targetY);
	};

	let openSet = new PriorityQueue({
		comparator: (a, b) => {
			if (fScore[a] === fScore[b]) return counts[b] - counts[a];
			return fScore[a] - fScore[b];
		},
		initialValues: [startPos],
	});
	let openSetEls = [];

	let cameFrom = [];
	let gScore = [];
	let fScore = [];

	let counter = 0;
	let counts = [];
	for (let i = 0; i < els.length; i++) {
		cameFrom.push(null);
		gScore.push(Infinity);
		fScore.push(Infinity);
		counts.push(0);
	}

	gScore[startPos] = 0;
	fScore[startPos] = h(startPos);

	while (openSet.length !== 0) {
		let changed = false;

		let current = openSet.dequeue();
		openSetEls.splice(openSetEls.indexOf(current), 1);

		if (current === targetPos) {
			path = [current];
			while (cameFrom[current] !== null) {
				current = cameFrom[current];
				path.unshift(current);
				if (current !== startPos && current !== targetPos) {
					els[current].status = "path";
					if (!instant) yield els.map((el) => el.status);
				}
			}
			break;
		}
		if (
			current !== startPos &&
			current !== targetPos &&
			els[current].status !== "visited"
		) {
			els[current].status = "visited";
			changed = true;
			// yield els.map((el) => el.status);
		}

		for (let neighbor of els[current].neighbors) {
			const tempGScore = gScore[current] + 1;

			if (tempGScore < gScore[neighbor]) {
				cameFrom[neighbor] = current;
				gScore[neighbor] = tempGScore;
				fScore[neighbor] = tempGScore + h(neighbor);
				if (!openSetEls.includes(neighbor)) {
					counter++;
					counts[neighbor] = counter;
					openSet.queue(neighbor);
					openSetEls.push(neighbor);

					if (
						neighbor !== startPos &&
						neighbor !== targetPos &&
						els[neighbor].status !== "queued"
					) {
						els[neighbor].status = "queued";
						changed = true;
					}
				}
			}
		}
		if (changed && !instant) {
			yield els.map((el) => el.status);
		}
	}
	yield els.map((el) => el.status);
}