const Discord = require('discord.js');
const prefix = require('../bot').prefix;

module.exports = async (msg, args) => {
    if (args.length) {
        oldPrefix = prefix[0];
        require('../bot').prefix.push(args[0]);
        require('../bot').prefix.splice(0, 1);

        const embed = new Discord.MessageEmbed()
            .setTitle('Le prefix a été changé')
            .setColor(0xff0000)
            .setDescription('Nouveau prefix: ' + prefix[0]);
        await msg.channel.send(embed);
        var client = await msg.guild.members.fetch(process.env.BOT_ID);
        client.user.setPresence({ status: "idle", activity: { name: prefix[0] + 'help | v1.0' } })
    } else {
        const embed = new Discord.MessageEmbed()
            .setTitle('Prefix')
            .setColor(0xff0000)
            .setDescription('Le prefix actuel est: ' + prefix[0]);
        await msg.channel.send(embed);
    }
}