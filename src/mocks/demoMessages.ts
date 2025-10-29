/**
 * Demo Messages Configuration
 *
 * Contains all demo/mock messages and responses used for testing.
 * This file can be easily updated to change the demo behavior.
 */

/**
 * Response templates for simulating replies to user messages
 */
export const DEMO_RESPONSES = [
  'Got your message: "{message}"',
  'Thanks for sharing! I received: "{message}"',
  'Interesting! You said: "{message}"',
  'Message received! "{message}"',
  '👍 Acknowledged: "{message}"',
  'I understand: "{message}"',
  'Great point! About "{message}"',
  'Let me think about: "{message}"',
];

/**
 * Random messages for auto-sending to chats (for testing unread badges)
 */
export const DEMO_AUTO_MESSAGES = [
  'Hey, are you there?',
  'Quick question for you',
  'Can we discuss this later?',
  'Just sent you the files',
  'Meeting in 10 minutes!',
  'Did you see my last message?',
  'Thanks for your help!',
  'Let me know when you are free',
  'Important update!',
  'Check this out 👀',
  'Are you available?',
  'Need your input on something',
  'Got a minute?',
  'Following up on our discussion',
  'Please review when you can',
];

/**
 * Group member names for simulating group chat participants
 */
export const DEMO_GROUP_MEMBERS = [
  'Alex Johnson',
  'Lisa Chen',
  'David Kim',
  'Sarah Parker',
  'Michael Brown',
  'Emma Wilson',
];

/**
 * Get a random response template and fill in the message
 */
export function getRandomResponse(originalMessage: string): string {
  const template =
    DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
  return template.replace('{message}', originalMessage);
}

/**
 * Get a random auto-send message
 */
export function getRandomAutoMessage(): string {
  return DEMO_AUTO_MESSAGES[
    Math.floor(Math.random() * DEMO_AUTO_MESSAGES.length)
  ];
}

/**
 * Get a random group member name
 */
export function getRandomGroupMember(): string {
  return DEMO_GROUP_MEMBERS[
    Math.floor(Math.random() * DEMO_GROUP_MEMBERS.length)
  ];
}
