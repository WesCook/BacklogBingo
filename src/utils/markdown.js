// Sanitize unfriendly characters in table cells
// Inline formatting characters are intentionally allowed (eg. italics, bold)
// Block formatting characters (headers, bullet lists, etc) already don't work in tables
export function sanitizeMarkdownTableCell(text) {
	return text
		.replaceAll('|', '\\|') // Escape pipes as they'll create new columns
		.replace(/\r\n?|\n/g, '<br>'); // Replace line breaks with HTML breaks as they'll create new rows
}
