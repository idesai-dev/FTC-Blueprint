/**
 * Calculates estimated reading time (minutes) based on word count.
 * Approx. 225 words per minute.
 */
export function calculateReadingTime(text: string): number {
	const wordsPerMinute = 225;
	const noOfWords = text.split(/\s+/).length;
	const minutes = noOfWords / wordsPerMinute;
	const readTime = Math.ceil(minutes);
	return readTime;
}
