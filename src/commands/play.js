const ytdl = require('ytdl-core');
const search = require('youtube-search');
const Discord = require('discord.js');

module.exports = async (msg, args) => {
    if (!msg.member.voice.channel) { 
        await msg.channel.send('Faut être dans un channel vocal mon chou 🙄'); 
        return;
    }
    if(msg.member.voice.channel.id === process.env.CHANNEL_AFK) {
        await msg.channel.send('T\'est pas dans un channel vocal approprié 😘'); 
        return;
    }
    if (!args.length) return;

    var opts = {
        maxresults: 2,
        key: process.env.YT_API_KEY,
        type: 'video'
    };

    var result = await search(args.join(' '), opts)

    msg.member.voice.channel.join().then(connection => {
        const stream = ytdl(result.results[0].link, { filter: 'audioonly' });
        const dispatcher = connection.play(stream);
        let embed = new Discord.MessageEmbed()
            .setColor("#73ffdc")
            .setDescription(result.results[0].title)
            .setTitle("Now playing");
        msg.channel.send(embed);

        dispatcher.on('finish', () => msg.member.voice.channel.leave());
    })
}