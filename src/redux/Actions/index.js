import {
	CHANGE_SIZE,
	SET_DELAY_REF,
	CHANGE_DIMENSIONS,
	SET_VISUALIZATION_ONGOING,
	SET_GENERATING,
	SET_PATH_VISIBLE,
	SET_SKIP_REF,
	SET_RESET,
} from "../action-types";

export const doChangeSize = (size) => ({
	type: CHANGE_SIZE,
	payload: size,
});

export const doSetDelayRef = (ref) => ({
	type: SET_DELAY_REF,
	payload: ref,
});

export const doChangeDimensions = (cols, rows) => ({
	type: CHANGE_DIMENSIONS,
	payload: { cols, rows },
});

export const doSetVisualizationOngoing = (bool) => ({
	type: SET_VISUALIZATION_ONGOING,
	payload: bool,
});
export const doSetGenerating = (generating) => ({
	type: SET_GENERATING,
	payload: generating,
});
export const doSetPathVisible = (bool) => ({
	type: SET_PATH_VISIBLE,
	payload: bool,
});
export const doSetSkipRef = (bool) => ({
	type: SET_SKIP_REF,
	payload: bool,
});
export const doSetReset = (bool) => ({
	type: SET_RESET,
	payload: bool,
});
