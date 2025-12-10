// test-claude.js
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 100,
  messages: [{
    role: 'user',
    content: 'Dis bonjour en une phrase'
  }]
});

console.log(message.content[0].text);