import { Client } from 'discord.js';
import config from '../fortune.json';

const bot = new Client();

bot.login(config.token);

module.exports = bot;

require('../handlers/event-handler');