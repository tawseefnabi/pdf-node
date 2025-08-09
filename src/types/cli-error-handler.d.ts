declare module 'cli-error-handler' {
	const handleError: (message: string, error: Error) => void;
	export default handleError;
}
