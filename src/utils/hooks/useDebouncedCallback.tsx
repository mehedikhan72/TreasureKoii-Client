import { useCallback, useRef } from "react";

const useDebouncedCallback = (func: (...args: any[]) => any, wait: number = 500) => {
	const timeout = useRef<any>();

	return useCallback(
		(...args: any[]) => {
			const later = () => {
				window.clearTimeout(timeout.current);
				func(...args);
			};

			clearTimeout(timeout.current);
			timeout.current = window.setTimeout(later, wait);
		},
		[func, wait]
	);
};

export default useDebouncedCallback;
