const Discord = require('discord.js');

module.exports = async (msg) => {
    if (msg.channel.nsfw) {
        await msg.channel.send('Pong');
    }
    else {
        const embed = new Discord.MessageEmbed()
            .setTitle('Nope nope nope')
            .setColor(0xff0000)
            .setDescription('Pas de ça ici voyons 👀');
        await msg.channel.send(embed);
    }
}