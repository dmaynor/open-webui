# Multi-Agent Chat UX Implementation

This patch adds support for rendering multi-agent responses in Open WebUI, where multiple AI agents can respond to a single user message, each with their own distinct chat bubble.

## Features

- **Multi-Agent Detection**: Automatically detects when a response contains multiple agent messages
- **Individual Agent Bubbles**: Each agent's response appears in its own chat bubble
- **Visual Distinction**: Each agent has a unique color and avatar (initials)
- **Backward Compatibility**: Regular single-agent responses continue to work as before

## Backend Response Format

Your backend should return responses in this JSON array format:

```json
[
  {"role": "RedTeamRick", "content": "Security analysis findings..."},
  {"role": "BlueTeamBeth", "content": "Defensive measures to implement..."},
  {"role": "AI_Assistant", "content": "Summary and action plan..."}
]
```

## Implementation Details

### Files Created/Modified

1. **`src/lib/utils/multiAgent.ts`** - Utility functions for multi-agent detection and parsing
   - `isMultiAgentResponse()` - Detects if content is a multi-agent response
   - `parseMultiAgentResponse()` - Parses JSON array into agent messages
   - Agent color mapping and avatar generation

2. **`src/lib/components/chat/Messages/MultiAgentResponse.svelte`** - New component for rendering individual agent messages
   - Displays agent avatar with initials
   - Shows agent name with unique color
   - Renders content using existing ContentRenderer

3. **`src/lib/components/chat/Messages/ResponseMessage.svelte`** - Modified to support multi-agent responses
   - Added detection logic for multi-agent responses
   - Renders multiple MultiAgentResponse components when detected
   - Falls back to regular rendering for single responses

4. **`src/routes/test-multi-agent/+page.svelte`** - Test page for verification
   - Visit `/test-multi-agent` to see the implementation in action

## Agent Colors

Pre-configured agent colors (easily extensible):

- RedTeamRick: Red (#DC2626)
- BlueTeamBeth: Blue (#2563EB)
- GreenTeamGary: Green (#16A34A)
- YellowTeamYvonne: Yellow (#F59E0B)
- PurpleTeamPete: Purple (#9333EA)
- AI_Assistant: Gray (#6B7280)

Add more agents in `src/lib/utils/multiAgent.ts` as needed.

## Testing

1. Start your development server
2. Navigate to `/test-multi-agent`
3. You should see:
   - A multi-agent response with 3 distinct agent bubbles
   - A regular single-agent response for comparison

## Integration with Your Backend

1. Modify your backend API to return the JSON array format when multiple agents respond
2. Ensure the response content type is still treated as a string (JSON stringified)
3. The frontend will automatically detect and render multi-agent responses

## Customization

### Adding New Agents

Edit `src/lib/utils/multiAgent.ts`:

```typescript
export const AGENT_COLORS: Record<string, string> = {
  'YourNewAgent': '#YourHexColor',
  // ... existing agents
};
```

### Styling

The component uses existing Open WebUI styles and respects dark/light mode settings. Agent names are colored while maintaining readability.

## Maintenance

This implementation is designed to be minimally invasive:
- Only activates when detecting the specific JSON array format
- All other functionality remains unchanged
- Easy to disable by removing the multi-agent detection check

## Future Enhancements

Consider adding:
- Agent-specific avatars/images instead of initials
- Hover effects showing agent descriptions
- Agent response ordering/grouping options
- Animation when agents "arrive"
- Agent typing indicators