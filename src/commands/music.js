const ytdl = require('ytdl-core');
const search = require('youtube-search');
const Discord = require('discord.js');
const servers = require('../bot').servers;
// to call a python script
const express = require('express');
const { spawn } = require('child_process');
const { PythonShell } = require('python-shell');

function play(connection, msg) {
    var server = servers[msg.guild.id];
    const stream = ytdl(server.queue[0].url, { filter: 'audioonly' });
    server.dispatcher = connection.play(stream);

    server.queue.shift();

    server.dispatcher.on("finish", async () => {
        if (server.queue[0]) {
            play(connection, msg);
            return;
        }
        connection.disconnect();
    })
}

module.exports = async (msg, args, command) => {
    if (msg.channel.id !== process.env.CHANNEL_MUSIQUE && msg.channel.id !== '719941433490145412') return;
    if (!msg.member.voice.channel) {
        await msg.channel.send('Faut être dans un channel vocal mon chou 🙄');
        return;
    }
    if (msg.member.voice.channel.id === process.env.CHANNEL_AFK) {
        await msg.channel.send('T\'est pas dans un channel vocal approprié 😘');
        return;
    }

    if (!servers[msg.guild.id]) {
        servers[msg.guild.id] = {
            queue: []
        }
    }

    switch (command) {
        case 'play':
            if (!args.length) return;

            // let options = {
            //     mode: 'text',
            //     pythonOptions: ['-u'], // get print results in real-time 
            //     scriptPath: '../tests', //If you are having python_test.py script in same folder, then it's optional. 
            //     args: [args.join(' ')] //An argument which can be accessed in the script using sys.argv[1] 
            // };
            // PythonShell.run('urlYtVid.py', options, function (err, result) {
            //     if (err) throw err;
            //     // result is an array consisting of messages collected  
            //     //during execution of script. 
            //     console.log('result: ', result.toString());
            //     // res.send(result.toString())
            // });
            // var dataToSend;
            // const python = spawn('python', ['..\\tests\\urlYtVid.py', args.join(' ')]);
            // python.stdout.on('data', function (data) {
            //     console.log('Pipe data from python script ...');
            //     dataToSend = data.toString();
            //     console.log(dataToSend);
            // });
            // python.on('close', (code) => {
            //     console.log(`child process close all stdio with code ${code}`);
            //     // send data to browser
            //     // res.send(dataToSend)
            //     console.log(dataToSend);
            // });

            var opts = {
                maxresults: 5,
                key: process.env.YT_API_KEY,
                type: 'video'
            };
            try {
                var result = await search(args.join(' '), opts);
            }
            catch (e) {
                if (e.response.status === 403) {
                    let embed = new Discord.MessageEmbed()
                        .setColor("#ff0000")
                        .setDescription('Plus de musique pour aujourd\'hui 😭')
                        .setTitle("❌ Erreur ❌");
                    msg.channel.send(embed);
                }
                else {
                    let embed = new Discord.MessageEmbed()
                        .setColor("#ff0000")
                        .setDescription('Une erreur est survenue 🤔')
                        .setTitle("❌ Erreur ❌");
                    msg.channel.send(embed);
                }
                return;
            }
            var resp = '';
            var numberOfChoices = 5;
            for (var i = 0; i < numberOfChoices; i++) {
                resp += `**[${parseInt(i) + 1}]** \'${result.results[i].title}\'\n`;
            }
            resp += `**[❌]** Cancel`;
            // resp += `\nChoisi le numéro (1-${numberOfChoices + 1})`;

            var theResult;
            msg.channel.send(resp).then(async function (sent) {
                await sent.react('1️⃣')
                    .then(() => sent.react('2️⃣'))
                    .then(() => sent.react('3️⃣'))
                    .then(() => sent.react('4️⃣'))
                    .then(() => sent.react('5️⃣'))
                    .then(() => sent.react('❌'))
                    .then(() => sent.awaitReactions(async function (reaction) {
                        switch (reaction._emoji.name) {
                            case '1️⃣':
                                theResult = await result.results[0];
                                sent.delete();
                                break;
                            case '2️⃣':
                                theResult = await result.results[1];
                                sent.delete();
                                break;
                            case '3️⃣':
                                theResult = await result.results[2];
                                sent.delete();
                                break;
                            case '4️⃣':
                                theResult = await result.results[3];
                                sent.delete();
                                break;
                            case '5️⃣':
                                theResult = await result.results[4];
                                sent.delete();
                                break;
                            case '❌':
                                sent.delete();
                                break;
                            default:
                                console.log('Autre emoji non pris en compte');
                        }
                    }));

                // const filter = m => !isNaN(m.content) && m.content < result.results.length + 1 && m.content > 0;
                // const collector = msg.channel.createMessageCollector(filter);
                // collector.result = result.results;

                // var theResult;
                // collector.once('collect', async function (m) {
                //     console.log(m.content);
                //     if (parseInt(m.content) === numberOfChoices + 1) return;
                //     theResult = await result.results[parseInt(m.content) - 1];

                if (!theResult) {
                    let embed = new Discord.MessageEmbed()
                        .setColor("#73ffdc")
                        .setDescription('Demande de musique annulée')
                        .setTitle("Canceled");
                    msg.channel.send(embed);
                    return;
                }
                var server = servers[msg.guild.id];
                server.queue.push({ url: theResult.link, title: theResult.title });

                let embed = new Discord.MessageEmbed()
                    .setColor("#73ffdc")
                    .setDescription(theResult.title)
                    .setTitle("Added to the queue");
                msg.channel.send(embed);

                if (msg.member.voice.channel.members.has(process.env.BOT_ID)) {
                    return;
                    // console.log(server.queue.length);
                    // if (server.queue.length === 1) {
                    //     connection => {
                    //         play(connection, msg); 
                    //     }
                    //     // msg.member.voice.channel.join().then(connection => {
                    //     //     play(connection, msg);
                    //     // })
                    // }
                    // else return;
                }
                else {
                    msg.member.voice.channel.join().then(connection => {
                        play(connection, msg);
                    })
                }
            })
            break;
        case 'skip':
            var server = servers[msg.guild.id];
            if (server.dispatcher)
                server.dispatcher.end(); // will end and go back to play (event) if there is something in the queue
            break;
        case 'pause':
            var server = servers[msg.guild.id];
            if (server.dispatcher) {
                server.dispatcher.pause();
            }
            break;
        case 'resume':
            var server = servers[msg.guild.id];
            if (server.dispatcher) {
                server.dispatcher.resume();
            }
            break;
        case 'leave':
            var server = servers[msg.guild.id];
            // if(msg.member.voice.channel.members.has(process.env.BOT_ID)) {
            if (msg.guild.voice.connection) {
                msg.guild.voice.connection.disconnect();
            }
            break;
        case 'queue':
            var server = servers[msg.guild.id];
            var resp = [];
            if (server.queue.length === 0) {
                resp.push('No song in the queue');
            }
            else {
                for (i in server.queue) {
                    resp += `${server.queue[i].title}\n`;
                }
            }
            let embed = new Discord.MessageEmbed()
                .setColor("#73ffdc")
                .setDescription(resp)
                .setTitle("Music queue");
            msg.channel.send(embed);
            break;
        default:
    }
}