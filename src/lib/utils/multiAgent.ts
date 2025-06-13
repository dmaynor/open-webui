// Multi-agent response utilities

export interface AgentMessage {
	role: string;
	content: string;
}

export function isMultiAgentResponse(content: string): boolean {
	try {
		const parsed = JSON.parse(content);
		return (
			Array.isArray(parsed) &&
			parsed.length > 0 &&
			parsed.every(
				(msg) =>
					typeof msg === 'object' &&
					typeof msg.role === 'string' &&
					typeof msg.content === 'string'
			)
		);
	} catch {
		return false;
	}
}

export function parseMultiAgentResponse(content: string): AgentMessage[] {
	try {
		const parsed = JSON.parse(content);
		if (isMultiAgentResponse(content)) {
			return parsed;
		}
		return [];
	} catch {
		return [];
	}
}

// Agent color mapping
export const AGENT_COLORS: Record<string, string> = {
	'RedTeamRick': '#DC2626',
	'BlueTeamBeth': '#2563EB',
	'GreenTeamGary': '#16A34A',
	'YellowTeamYvonne': '#F59E0B',
	'PurpleTeamPete': '#9333EA',
	'OrangeTeamOliver': '#EA580C',
	'CyanTeamCindy': '#06B6D4',
	'PinkTeamPaula': '#EC4899',
	'IndigoTeamIan': '#6366F1',
	'TealTeamTina': '#14B8A6',
	'AI_Assistant': '#6B7280',
	// Default fallback will be gray
};

export function getAgentColor(agentName: string): string {
	return AGENT_COLORS[agentName] || '#6B7280';
}

export function getAgentInitials(agentName: string): string {
	// Handle special cases
	if (agentName === 'AI_Assistant') return 'AI';
	
	// Extract initials from camelCase or underscore separated names
	const words = agentName.split(/(?=[A-Z])|_/);
	const initials = words
		.map(word => word[0])
		.filter(char => char && char.match(/[A-Za-z]/))
		.join('')
		.toUpperCase()
		.slice(0, 2);
	
	return initials || agentName.slice(0, 2).toUpperCase();
}