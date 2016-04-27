/*
 * ComputerBot
 * ------------------
 * GitHub: https://github.com/Mrcomputer1/ComputerBot
 * Issues: https://github.com/Mrcomputer1/ComputerBot/issues
 * License: MIT License (See LICENSE file)
 * -----------------
 * This is the main file for ComputerBot it contains the bot code and the HTTP server used to display channel IDs and OpenShift's /health URL
*/
var bot_config = {
	restart_password: "(private)",
	shutdown_password: "(private)",
	bot_api_token: "(private)",
	bot_debug: false
}

var Botkit = require('botkit');
//var fs = require("fs");
var http = require("http");
var env = process.env;
var exec = require('child_process').exec;
 
var sbot = Botkit.slackbot({
	debug: bot_config.bot_debug
});
var $_temp1 = "";
 
sbot.spawn({
	token: bot_config.bot_api_token,
}).startRTM()
 //'direct_message','direct_mention','mention

sbot.hears(['^what can you do$', '^help$'], ["mention", "direct_mention", "direct_message"], function(bot, message){
	bot.startPrivateConversation(message, function(res, dm){
		dm.say("*--------------------[Start command list]--------------------*");
		dm.say("_sayas_ or _sayasurl_ for Image URL : Send a message as someone else : Mention");
		dm.say("_sayas_ or _sayasurl_ for Image URL : Send a message as someone else (asks for channel id) : Direct mention, Direct message");
		dm.say("_channelid_ : Says the channel ID : Mention, Direct message");
		dm.say("_userid_ : Says the user ID : Mention, Direct message");
		dm.say("_shutdown_: Shuts the bot down : Direct message");
		dm.say("_restart_: Restarts the bot : Direct message");
		dm.say("_say (name) (emoji) (channel id) (message - __ for space)_: Quick sayas command : Direct message");
		dm.say("_say (name) (url) (channel id) (message - __ for space)_: Quick sayas command : Direct message");
		dm.say("*--------------------[End Command List]--------------------*");
	});
});
sbot.hears(['sayas'], ["mention", "direct_mention"], function(bot, message){
	$_temp1 = bot;
	bot.startPrivateConversation(message, function(res, dm){
		dm._bot = $_temp1;
		dm.ask('Say as who?', function(res, dm){
			dm._who = res.text;
			dm.next();
			dm.ask('Icon Emoji?', function(res, dm){
				dm._emoji = res.text;
				dm.next();
				dm.ask('Message?', function(res, dm){
					dm._msg = res.text;
					dm._bot.reply(message,{
						text: dm._msg,
						username: dm._who,
						icon_emoji: dm._emoji
					});
					dm.next();
				})
			})
		})
	});
});
sbot.hears(['^sayas$'], ["direct_message"], function(bot, message){
	$_temp1 = bot;
	bot.startPrivateConversation(message, function(res, dm){
		dm._bot = $_temp1;
		dm.ask('Say as who?', function(res, dm){
			dm._who = res.text;
			dm.next();
			dm.ask('Icon Emoji?', function(res, dm){
				dm._emoji = res.text;
				dm.next();
				dm.ask('Message?', function(res, dm){
					dm._msg = res.text;
					dm.next();
					dm.ask('Channel ID? Check http://scratchaterscomputerbot-mrcomputer1.rhcloud.com/channel_ids/ or say @computerbot: channelid on the channel!', function(res, dm){
						dm._ch = res.text;
						dm._bot.say({
							text: dm._msg,
							username: dm._who,
							icon_emoji: dm._emoji,
							channel: dm._ch
						});
						dm.next();
					})
				})
			})
		})
	});
});
sbot.hears(['say (.*) (.*) (.*) (.*)'], ["direct_message"], function(bot, message){
	bot.say({
		text: message.match[4].replace(/__/g, " "),
		username: message.match[1],
		icon_emoji: message.match[2],
		channel: message.match[3]
	});
});
sbot.hears(['channelid'], ['mention', 'direct_mention'], function(bot, message){
	bot.startPrivateConversation(message, function(res, dm){
		dm.say("Channel ID: " + message.channel);
	});
});
sbot.hears(['userid'], ['mention', 'direct_mention'], function(bot, message){
	bot.startPrivateConversation(message, function(res, dm){
		dm.say("Your User ID: " + message.user);
	});
});
sbot.hears(['^shutdown$'], ['direct_message'], function(bot, message){
	bot.startPrivateConversation(message, function(res, dm){
		dm.ask('Enter shutdown code?', function(res, dm){
			if(res.text == bot_config.shutdown_password){
				dm.say("Shutting down!");
				process.exit();
				dm.next();
			}else{
				dm.say("Bad password!");
				dm.next();
			}
		})
	});
});
sbot.hears(['^restart$'], ['direct_message'], function(bot, message){
	bot.startPrivateConversation(message, function(res, dm){
		dm.ask('Enter restart code?', function(res, dm){
			if(res.text == bot_config.restart_password){
				dm.say("Restarting!");
				var child = exec("node ./ComputerBotStartScript.js");
				setTimeout(function(){
					process.exit();
				}, 2000);
				dm.next();
			}else{
				dm.say("Bad password!");
				dm.next();
			}
		})
	});
});
sbot.hears(['sayasurl'], ["mention", "direct_mention"], function(bot, message){
	$_temp1 = bot;
	bot.startPrivateConversation(message, function(res, dm){
		dm._bot = $_temp1;
		dm.ask('Say as who?', function(res, dm){
			dm._who = res.text;
			dm.next();
			dm.ask('Icon URL?', function(res, dm){
				dm._url = res.text;
				dm.next();
				dm.ask('Message?', function(res, dm){
					dm._msg = res.text;
					dm._bot.reply(message,{
						text: dm._msg,
						username: dm._who,
						icon_url: dm._url,
						as_user: false
					});
					dm.next();
				})
			})
		})
	});
});
sbot.hears(['^sayasurl$'], ["direct_message"], function(bot, message){
	$_temp1 = bot;
	bot.startPrivateConversation(message, function(res, dm){
		dm._bot = $_temp1;
		dm.ask('Say as who?', function(res, dm){
			dm._who = res.text;
			dm.next();
			dm.ask('Icon URL?', function(res, dm){
				dm._url = res.text;
				dm.next();
				dm.ask('Message?', function(res, dm){
					dm._msg = res.text;
					dm.next();
					dm.ask('Channel ID? Check http://scratchaterscomputerbot-mrcomputer1.rhcloud.com/channel_ids/ or say @computerbot: channelid on the channel!', function(res, dm){
						dm._ch = res.text;
						dm._bot.say({
							text: dm._msg,
							username: dm._who,
							icon_url: dm._url,
							channel: dm._ch,
							as_user: false
						});
						dm.next();
					})
				})
			})
		})
	});
});
sbot.hears(['sayurl (.*) (.*) (.*) (.*)'], ["direct_message"], function(bot, message){
	bot.say({
		text: message.match[4].replace(/__/g, " "),
		username: message.match[1],
		icon_url: message.match[2],
		channel: message.match[3],
		as_user: false
	});
});
var page_channel_ids = "Channel IDS: <br>" +
"<table>" +
	"<thead style='background-color:lightgrey'>" +
		"<tr><td>Channel Name</td><td>Channel ID</td></tr>" +
	"</thead>" +
	"<tbody>" +
		"<tr><td>#general</td><td>C0SEAJWJX</td></tr>" +
		"<tr><td>#scratch</td><td>C0SUFBYBE</td></tr>" +
		"<tr><td>#random</td><td>C0SFK012S</td></tr>" +
		"<tr><td>#offtopic</td><td>C0SP3HY4C</td></tr>" +
		"<tr><td>#thetimeline</td><td>C0T9D54P9</td></tr>" +
		"<tr><td>#nohubotallowed</td><td>C0U2EBC2G</td></tr>" +
		"<tr><td>#musician_aters</td><td>C0TUC0K6J</td></tr>" +
		"<tr><td>#bots</td><td>C0T73S4KF</td></tr>" +
		"<tr><td>#formatting-testing</td><td>C0T8ZPLRM</td></tr>" +
		"<tr><td>#bot-tests</td><td>C0U1JMXSP</td></tr>" +
		"<tr><td>#computer-bot</td><td>C108EE5D0</td></tr>" +
	"</tbody>" +
"</table>" + "<br><br>" +
"If any ID is not working or a channel is messaging then please report it by Direct Messaging @mrcomputer1 on the Scratch-ATers Slack";

var server = http.createServer(function(req, res){
	var url = req.url;
	if(url == "/"){
		res.writeHead(200);
		res.end("Welcome to ComputerBot!");
	}else if(url == "/health"){
		res.writeHead(200);
		res.end("Working well!");
	}else if(url == "/channel_ids/"){
		res.setHeader('Content-Type', "text/html;charset=utf-8");
		res.writeHead(200);
		res.end(page_channel_ids);
	}
	else{
		res.writeHead(404);
		res.end("404 Not Found");
	}
}).listen(env.NODE_PORT || 3000, env.NODE_IP || "localhost");