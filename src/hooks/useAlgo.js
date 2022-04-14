import { memo, useEffect, useState } from "react";
import { useDrag } from "@use-gesture/react";
import depthFirstSearchMaze from "../maze_generators/depthFirstSearchMaze";
import { useDispatch, useSelector } from "react-redux";
import { doSetVisualizationOngoing } from "../redux/Actions";
import Node from "../components/Grid/Node";

export default function useAlgo(mainRef) {
	const size = useSelector((state) => state.size);
	const cols = useSelector((state) => state.dimensions.cols);
	const rows = useSelector((state) => state.dimensions.rows);
	const delayRef = useSelector((state) => state.delayRef);
	const visualizationOngoing = useSelector(
		(state) => state.visualizationOngoing
	);

	const dispatch = useDispatch();

	const [elements, setElements] = useState([]);
	const [gridStart, setGridStart] = useState({
		left: 0,
		top: 0,
	});
	useEffect(() => {
		if (mainRef === null) return;
		setGridStart({
			left: mainRef.offsetLeft,
			top: mainRef.offsetTop,
		});
	}, [mainRef, mainRef?.current?.offsetLeft]);

	const [paintNodes, setPaintNodes] = useState(null);

	const getIdxFromCoords = (x, y) => {
		const nodeX = Math.floor((x - gridStart.left) / size);
		const nodeY = Math.floor((y - gridStart.top) / size);
		return cols * nodeY + nodeX >= elements.length ||
			cols * nodeY + nodeX < 0 ||
			x <= gridStart.left ||
			x >= gridStart.left + cols * size ||
			y <= gridStart.top ||
			y >= gridStart.top + rows * size
			? null
			: cols * nodeY + nodeX;
	};
	const bind = useDrag(({ canceled, buttons, cancel, down, xy: [x, y] }) => {
		if (
			x < 0 ||
			y < 0 ||
			canceled ||
			visualizationOngoing ||
			buttons === 0
		) {
			setPaintNodes(null);
			cancel();
			return;
		}
		const currentNode = getIdxFromCoords(x, y);
		if (paintNodes === null) {
			if (elements[getIdxFromCoords(x, y)] === "empty") {
				setPaintNodes("toWall");
				setElements((prevElements) => [
					...prevElements.slice(0, currentNode),
					"wall",
					...prevElements.slice(currentNode + 1),
				]);
			} else {
				setPaintNodes("toEmpty");
				setElements((prevElements) => [
					...prevElements.slice(0, currentNode),
					"empty",
					...prevElements.slice(currentNode + 1),
				]);
			}
		}
		if (!down) setPaintNodes(null);

		if (currentNode === null || currentNode >= elements.length) {
			return;
		}
		if (paintNodes === "toWall" && elements[currentNode] !== "wall") {
			setElements((prevElements) => [
				...prevElements.slice(0, currentNode),
				"wall",
				...prevElements.slice(currentNode + 1),
			]);
		} else if (
			paintNodes === "toEmpty" &&
			elements[currentNode] !== "empty"
		) {
			setElements((prevElements) => [
				...prevElements.slice(0, currentNode),
				"empty",
				...prevElements.slice(currentNode + 1),
			]);
		}
	}, {});

	const generate = async () => {
		const generator = depthFirstSearchMaze(elements.length, cols);
		while (true) {
			await sleep(parseInt(delayRef.current.textContent));
			const out = generator.next();
			if (out.done === true) {
				dispatch(doSetVisualizationOngoing(false));
				break;
			}
			setElements(out.value);
		}
	};

	useEffect(() => {
		if (visualizationOngoing) {
			generate();
		}
	}, [visualizationOngoing]);

	const updateElements = (nodes) =>
		nodes.map((el, idx) => (
			<Node look={el} idx={idx} bind={{ ...bind() }} key={idx} />
		));

	useEffect(() => {
		let cleanGrid = [];
		for (let i = 0; i < cols * rows; i++) {
			cleanGrid.push("empty");
		}
		setElements(cleanGrid);
	}, [cols, rows]);

	return updateElements(elements);
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
