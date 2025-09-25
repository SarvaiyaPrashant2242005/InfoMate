const API_BASE = process.env.REACT_APP_API_BASE || ''; // Empty for relative path

export async function sendChatMessage(message, history = []) {
	try {
		const res = await fetch(`${API_BASE}/api/chat`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message, history }),
		});

		// Try to parse JSON either way
		let data = null;
		const text = await res.text();
		try {
			data = text ? JSON.parse(text) : null;
		} catch (_e) {
			data = null;
		}

		if (!res.ok) {
			const serverMsg = (data && (data.error?.message || data.error || data.message)) || text || 'Unknown server error';
			const err = new Error(serverMsg);
			err.name = 'ChatApiError';
			err.status = res.status;
			err.code = data?.error?.code || data?.code || undefined;
			// A short, user-facing message for UI display
			err.userMessage = mapErrorToUserMessage(err);
			throw err;
		}

		return data ?? {};
	} catch (err) {
		// Network or parsing errors
		if (!err.name) err.name = 'ChatApiError';
		if (!err.userMessage) err.userMessage = mapErrorToUserMessage(err);
		throw err;
	}
}

function mapErrorToUserMessage(err) {
	const status = err?.status;
	const raw = `${err?.message || ''}`.toLowerCase();

	if (raw.includes('failed to fetch') || raw.includes('network') || raw.includes('networkerror')) {
		return 'I could not reach the server. Please check your internet connection and that the server is running.';
	}
	if (status === 429) return 'I am receiving too many requests right now. Please wait a moment and try again.';
	if (status === 503 || raw.includes('timeout')) return 'The server took too long to respond. Please try again shortly.';
	if (status === 500 && raw.includes('google_api_key')) return 'Server is misconfigured (missing API key). Please set the GOOGLE_API_KEY on the server and try again.';
	if (status === 500) return 'The server had a problem generating an answer. Please try again shortly.';
	if (status === 400) return 'Your request seems incomplete. Please try rephrasing your question.';
	return 'Sorry, I ran into a problem answering that. Please try again shortly.';
}
