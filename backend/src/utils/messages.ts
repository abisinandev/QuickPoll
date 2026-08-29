/**
 * Centralized response messages used across controllers and services.
 */
export const MESSAGES = {
  USER: {
    JOINED: 'Joined successfully',
    UNAUTHENTICATED: 'Unauthenticated',
    SESSION_FETCHED: 'Current user session fetched',
    UNAUTHORIZED: 'Unauthorized. Please join QuickPoll first.',
    USERNAME_REQUIRED: 'Username is required',
    USERNAME_EMPTY: 'Username cannot be empty',
    USERNAME_LENGTH: 'Username must be between 2 and 30 characters',
    USERNAME_TAKEN: 'That username was just taken. Please choose a different one.',
    LEFT: 'Left QuickPoll successfully',
  },

  POLL: {
    FETCHED: 'Polls retrieved successfully',
    VOTE_RECORDED: 'Vote recorded successfully',
    VOTE_UPDATED: 'Vote updated successfully',
    VOTE_REMOVED: 'Vote removed successfully',
    NOT_FOUND: 'Poll not found',
    NOT_ACTIVE: 'Poll is not active',
    OPTION_NOT_FOUND: 'Option does not belong to this poll',
    IDS_REQUIRED: 'Poll ID and Option ID are required',
  },

  CHAT: {
    HISTORY_FETCHED: 'Chat history retrieved successfully',
    MESSAGE_EMPTY: 'Message cannot be empty',
    MESSAGE_TOO_LONG: 'Message exceeds maximum length of 200 characters',
    SEND_FAILED: 'Failed to send message',
  },

  SERVER: {
    ROUTE_NOT_FOUND: (method: string, url: string) =>
      `Route ${method} ${url} not found`,
  },
} as const;
