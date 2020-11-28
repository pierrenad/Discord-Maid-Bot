const Discord = require('discord.js');
const getUrlTitle = require("get-url-title");
const ytdl = require('ytdl-core');
const servers = require('../bot').servers;

module.exports = async (msg, args, command) => {
    var server = servers[msg.guild.id]; 
    await msg.channel.send('Ca fonctionne 😊');

    // add a text channel under category
    // msg.guild.channels.create('testing', { type: 'text' }).then(channel => {
    //     let category = msg.guild.channels.cache.find(c => c.name == "Salons textuels" && c.type == "category");
    //     if (!category) return;
    //     channel.setParent(category.id);
    // }).catch(console.error);

    // function play(connection, msg) {
    //     var server = servers[msg.guild.id];
    //     console.log(server.queue);
    //     const stream = ytdl(server.queue[0].url, { filter: 'audioonly' });
    //     server.dispatcher = connection.play(stream);

    //     server.queue.shift();
    //     console.log(server.queue);

    //     server.dispatcher.on("finish", async () => {
    //         if (server.queue[0]) {
    //             play(connection, msg);
    //             return;
    //         }
    //         connection.disconnect();
    //     })
    // }
    // var urlTitle = await getUrlTitle(args.join(' '));
    // console.log(server.queue);
    // server.queue.push({ url: args.join(' '), title: urlTitle });

    // let embed = new Discord.MessageEmbed()
    //     .setColor("#73ffdc")
    //     .setDescription(urlTitle)
    //     .setTitle("Added to the queue");
    // msg.channel.send(embed);

    // if (msg.member.voice.channel.members.has(process.env.BOT_ID)) {
    //     return;
    // }
    // else {
    //     msg.member.voice.channel.join().then(connection => {
    //         play(connection, msg);
    //     })
    // }
}