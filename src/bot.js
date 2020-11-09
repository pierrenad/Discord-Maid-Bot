/***************************
 * Created by pierrenad
 * Maid Bot for discord
 **************************/

require('dotenv').config(); // get the environment variables into process.env
const Discord = require('discord.js');
const client = new Discord.Client();

const commandHandler =  require('./commands')

client.once('ready', () => {
    console.log('Here I am');
})

client.on('message', commandHandler); 

client.login(process.env.BOT_TOKEN);