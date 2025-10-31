const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const sampleTexts = [
  'Hey, are you there?',
  'Meeting in 10 minutes!',
  'Thanks for your help!',
  'Can we discuss this later?',
  'Just sent you the files',
  'Quick question for you',
  'Check this out 👀',
  'Got a minute?',
  'Need your input on something',
  'Please review when you can',
  'Are you available?',
  'Important update!',
  'Let me know what you think',
  'Sounds good to me',
  'I agree with that',
  "Let's do it!",
  'Perfect timing',
  'On my way',
  'Be there soon',
  'Running a bit late',
  'Almost done here',
  'Give me 5 minutes',
  'That works for me',
  "I'll get back to you",
  'Looking into it now',
  'Good point!',
  'Makes sense',
  'Interesting idea',
  'Let me think about it',
  'I have some concerns',
  'What do you think?',
  'Any updates?',
  'Still working on it',
  'Just finished',
  'All set!',
  'Ready when you are',
  "Let's get started",
  'Breaking for lunch',
  'Back online',
  'Logging off for today',
  'See you tomorrow!',
  'Have a great weekend',
  'Happy Monday!',
  'TGIF 🎉',
  'Coffee break ☕',
  'In a meeting',
  'Back at my desk',
  'Working from home today',
  'Out of office',
  'Checking email',
  'Will respond shortly',
];

const emojis = ['👍', '👎', '❤️', '🎉', '🔥', '💯', '😊', '😂', '🤔', '👀'];

function generateMessages(count = 1000) {
  const messages = [];
  const currentUserId = '550e8400-e29b-41d4-a716-446655440000';
  const otherUserId = 'user-6ba7b810-9dad-11d1-80b4-00c04fd430c8';

  // Start from 30 days ago
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  for (let i = 0; i < count; i++) {
    // 30% chance message is from current user
    const isFromMe = Math.random() < 0.3;
    const senderId = isFromMe ? currentUserId : otherUserId;
    const senderName = isFromMe ? 'Me' : 'Alex Johnson';

    // Generate timestamp - spread messages over 30 days
    const messageDate = new Date(startDate);
    messageDate.setMinutes(messageDate.getMinutes() + i * 43);

    // Randomly select message text
    let text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];

    // 10% chance to add emoji
    if (Math.random() < 0.1) {
      text += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
    }

    // 5% chance for a longer message
    if (Math.random() < 0.05) {
      const numSentences = Math.floor(Math.random() * 3) + 2;
      const sentences = [];
      for (let j = 0; j < numSentences; j++) {
        sentences.push(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
      }
      text = sentences.join(' ');
    }

    messages.push({
      id: uuidv4(),
      text,
      senderId,
      senderName,
      time: messageDate.toISOString(),
      isFromMe,
    });
  }

  // Sort by time (oldest first)
  messages.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return messages;
}

// Generate 1000 messages
const messages = generateMessages(1000);

// Write to file
fs.writeFileSync('test-messages-1000.json', JSON.stringify(messages, null, 2));

console.log('✅ Generated 1000 test messages');
console.log('📁 File: test-messages-1000.json');
console.log(`📊 File size: ${(JSON.stringify(messages).length / 1024).toFixed(2)} KB`);
console.log('\n📋 To copy to localStorage:');
console.log('   1. Open the JSON file');
console.log('   2. Copy the entire content');
console.log('   3. In browser console, run:');
console.log('      localStorage.setItem("messages_user-6ba7b810-9dad-11d1-80b4-00c04fd430c8", \'[PASTE_JSON_HERE]\')');
