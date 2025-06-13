<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { i18n as i18nType } from 'i18next';
	
	import { models, settings } from '$lib/stores';
	import { WEBUI_BASE_URL } from '$lib/constants';
	
	import ProfileImage from './ProfileImage.svelte';
	import Name from './Name.svelte';
	import ContentRenderer from './ContentRenderer.svelte';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import dayjs from 'dayjs';
	import { formatDate } from '$lib/utils';

	const i18n = getContext<Writable<i18nType>>('i18n');

	export let agentMessage: {
		role: string;
		content: string;
	};
	export let messageId: string;
	export let idx: number;
	export let timestamp: number;
	export let history;
	export let onSave: Function = () => {};
	export let onSourceClick: Function = () => {};
	export let onTaskClick: Function = () => {};
	export let onAddMessages: Function = () => {};

	// Agent-specific styling
	const agentColors = {
		'RedTeamRick': '#DC2626',
		'BlueTeamBeth': '#2563EB',
		'GreenTeamGary': '#16A34A',
		'YellowTeamYvonne': '#F59E0B',
		'PurpleTeamPete': '#9333EA',
		'AI_Assistant': '#6B7280',
		// Add more agents as needed
	};

	const getAgentColor = (agentName: string) => {
		return agentColors[agentName] || '#6B7280'; // Default gray
	};

	const getAgentAvatar = (agentName: string) => {
		// You can customize this to return specific avatars per agent
		// For now, using initials
		const initials = agentName
			.split(/(?=[A-Z])|_/)
			.map(word => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
		return initials;
	};

	$: agentColor = getAgentColor(agentMessage.role);
	$: agentInitials = getAgentAvatar(agentMessage.role);
</script>

<div class="flex w-full message-{messageId}-agent-{idx}" dir={$settings.chatDirection}>
	<div class="shrink-0 ltr:mr-3 rtl:ml-3 hidden @lg:flex">
		<div 
			class="size-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
			style="background-color: {agentColor}"
		>
			{agentInitials}
		</div>
	</div>

	<div class="flex-auto w-0 pl-1 relative -translate-y-0.5">
		<Name>
			<Tooltip content={agentMessage.role} placement="top-start">
				<span class="line-clamp-1" style="color: {agentColor}">
					{agentMessage.role}
				</span>
			</Tooltip>

			{#if timestamp}
				<div
					class="self-center text-xs invisible group-hover:visible text-gray-400 font-medium first-letter:capitalize ml-0.5 translate-y-[1px]"
				>
					<Tooltip content={dayjs(timestamp * 1000).format('LLLL')}>
						<span class="line-clamp-1">{formatDate(timestamp * 1000)}</span>
					</Tooltip>
				</div>
			{/if}
		</Name>

		<div>
			<div class="chat-assistant w-full min-w-full markdown-prose">
				<div class="w-full flex flex-col relative">
					<ContentRenderer
						id="{messageId}-agent-{idx}"
						{history}
						content={agentMessage.content}
						sources={null}
						save={false}
						preview={false}
						{onSave}
						{onSourceClick}
						{onTaskClick}
						{onAddMessages}
					/>
				</div>
			</div>
		</div>
	</div>
</div>