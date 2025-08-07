declare module 'cli-error-handler' {
	/**
	 * Handles and logs errors in a CLI application
	 * @param message Error message
	 * @param error The error object
	 */
	function handleError(message: string, error: Error): void;

	export = handleError;
}
