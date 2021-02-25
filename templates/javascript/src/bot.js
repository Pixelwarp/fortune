const { Client } = require('discord.js');
const config = require('../fortune.json');

const bot = new Client();

bot.login(config.token);

module.exports = bot;

require('../handlers/event-handler');