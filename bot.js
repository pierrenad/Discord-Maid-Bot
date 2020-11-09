require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const botCallSign = '!';

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log('Here I am');
})

client.on('message', (msg) => {
    console.log(msg.content);

    if(msg.channel.id === '719941433490145412' && msg.content === botCallSign+'test') {
        //msg.reply('Ca fonctionne 😊'); 
        msg.channel.send('Ca fonctionne 😊'); // so that the @ mention isn't there 
    }
})