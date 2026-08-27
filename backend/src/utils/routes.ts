/**
 * Centralized API route path constants.
 */
export const ROUTES = {
  HEALTH: '/api/health',

  USER: {
    BASE: '/api/users',
    JOIN: '/join',
    ME: '/me',
    LEAVE: '/leave',
  },

  POLL: {
    BASE: '/api/polls',
    GET_ALL: '/',
    VOTE: '/:pollId/vote',
  },

  CHAT: {
    BASE: '/api/chat',
    GET_MESSAGES: '/messages',
  },
} as const;
