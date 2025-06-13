<script lang="ts">
	import { onMount } from 'svelte';
	import ResponseMessage from '$lib/components/chat/Messages/ResponseMessage.svelte';
	import { settings } from '$lib/stores';

	// Mock history for testing
	let mockHistory = {
		messages: {
			'msg-1': {
				id: 'msg-1',
				role: 'user',
				content: 'Test multi-agent responses',
				timestamp: Date.now() / 1000,
				parentId: null,
				childrenIds: ['msg-2']
			},
			'msg-2': {
				id: 'msg-2',
				role: 'assistant',
				model: 'multi-agent-system',
				content: JSON.stringify([
					{"role": "RedTeamRick", "content": "I've analyzed the security vulnerabilities in your system. The main issues are: 1) Weak authentication on the API endpoints, 2) No rate limiting on critical routes, and 3) Insufficient input validation. We need to address these immediately."},
					{"role": "BlueTeamBeth", "content": "I agree with Rick's assessment. I'll implement the following defensive measures: 1) Add JWT authentication with refresh tokens, 2) Implement rate limiting using Redis, and 3) Add comprehensive input validation using Joi schemas. I can have these ready by end of week."},
					{"role": "AI_Assistant", "content": "Based on the security team's analysis, here's the prioritized action plan:\n\n**Immediate Actions (Today):**\n- Implement rate limiting on authentication endpoints\n- Add basic input validation\n\n**This Week:**\n- Complete JWT authentication implementation\n- Full input validation coverage\n- Security audit of existing code\n\nWould you like me to create tickets for these tasks?"}
				]),
				timestamp: Date.now() / 1000,
				done: true,
				parentId: 'msg-1',
				childrenIds: []
			},
			'msg-3': {
				id: 'msg-3',
				role: 'assistant',
				model: 'gpt-4',
				content: 'This is a regular single-agent response for comparison. It should render normally as a single bubble.',
				timestamp: Date.now() / 1000,
				done: true,
				parentId: 'msg-1',
				childrenIds: []
			}
		},
		currentId: 'msg-2'
	};

	// Mock functions
	const mockFunctions = {
		updateChat: () => console.log('Update chat'),
		editMessage: () => console.log('Edit message'),
		saveMessage: () => console.log('Save message'),
		rateMessage: () => console.log('Rate message'),
		actionMessage: () => console.log('Action message'),
		deleteMessage: () => console.log('Delete message'),
		submitMessage: () => console.log('Submit message'),
		continueResponse: () => console.log('Continue response'),
		regenerateResponse: () => console.log('Regenerate response'),
		addMessages: () => console.log('Add messages'),
		showPreviousMessage: () => console.log('Show previous'),
		showNextMessage: () => console.log('Show next'),
		gotoMessage: () => console.log('Goto message')
	};

	onMount(() => {
		// Set dark mode for testing
		document.documentElement.classList.add('dark');
	});
</script>

<div class="min-h-screen bg-white dark:bg-gray-900 p-8">
	<div class="max-w-4xl mx-auto space-y-8">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
			Multi-Agent Response Test
		</h1>

		<div class="space-y-6">
			<div class="border-b border-gray-200 dark:border-gray-700 pb-4">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
					Multi-Agent Response (JSON Array)
				</h2>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					This should render as multiple distinct agent bubbles
				</p>
			</div>

			<ResponseMessage
				chatId="test-chat"
				history={mockHistory}
				messageId="msg-2"
				siblings={['msg-2', 'msg-3']}
				isLastMessage={true}
				{...mockFunctions}
			/>

			<div class="border-b border-gray-200 dark:border-gray-700 pb-4 mt-12">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
					Regular Single Response
				</h2>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					This should render as a normal single bubble
				</p>
			</div>

			<ResponseMessage
				chatId="test-chat"
				history={mockHistory}
				messageId="msg-3"
				siblings={['msg-2', 'msg-3']}
				isLastMessage={true}
				{...mockFunctions}
			/>
		</div>

		<div class="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
				Expected Backend Response Format
			</h3>
			<pre class="bg-gray-900 dark:bg-black text-green-400 p-4 rounded overflow-x-auto text-sm">
{JSON.stringify([
  {"role": "RedTeamRick", "content": "Agent reply #1..."},
  {"role": "BlueTeamBeth", "content": "Agent reply #2..."},
  {"role": "AI_Assistant", "content": "Agent reply #3..."}
], null, 2)}
			</pre>
		</div>
	</div>
</div>

<style>
	:global(.chat-assistant) {
		/* Ensure proper styling for multi-agent responses */
		@apply text-gray-900 dark:text-gray-100;
	}
</style>