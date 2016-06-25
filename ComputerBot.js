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
	bot_api_token: "(private)-(private)-(private)",
	bot_debug: false,
	log_file_name: "chat-messages.log"
};

var Botkit = require('botkit');
//var fs = require("fs");
var http = require("http");
var env = process.env;
var exec = require('child_process').exec;
var fs = require("fs");
 
var sbot = Botkit.slackbot({
	debug: bot_config.bot_debug
});
var $_temp1 = "";
 
sbot.spawn({
	token: bot_config.bot_api_token,
}).startRTM()
 //'direct_message','direct_mention','mention
 
var log_message = function(sender, username, message, icon, ch){
	fs.appendFile(bot_config.log_file_name, "\nUsername:" + username + ", Icon Emoji: " + icon + ", Channel: " + ch + ", Message: " + message + ", User: " + sender, function(err){});
};

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
	console.log(JSON.stringify(message));
	$_temp1 = {bot: bot, message: message};
	bot.startPrivateConversation(message, function(res, dm){
		dm._bot = $_temp1.bot;
		dm._message = $_temp1.message;
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
					log_message(dm._message.user, dm._who, dm._msg, dm._emoji, dm._message.channel);
					dm.next();
				})
			})
		})
	});
});
sbot.hears(['^sayas$'], ["direct_message"], function(bot, message){
	$_temp1 = {bot: bot, message: message};
	bot.startPrivateConversation(message, function(res, dm){
		dm._bot = $_temp1.bot;
		dm._message = $_temp1.message;
		dm.ask('Say as who?', function(res, dm){
			dm._who = res.text;
			dm.next();
			dm.ask('Icon Emoji?', function(res, dm){
				dm._emoji = res.text;
				dm.next();
				dm.ask('Message?', function(res, dm){
					dm._msg = res.text;
					dm.next();
					dm.ask('Channel ID? Check http://scratchaterscomputerbot-mrcomputer1.rhcloud.com/id_finder/ or say @computerbot: channelid on the channel!', function(res, dm){
						dm._ch = res.text;
						dm._bot.say({
							text: dm._msg,
							username: dm._who,
							icon_emoji: dm._emoji,
							channel: dm._ch
						});
						log_message(dm._message.user, dm._who, dm._msg, dm._emoji, dm._ch);
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
	log_message(message.user, message.match[1], message.match[4].replace(/__/g, " "), message.match[2], message.match[3]);
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
	$_temp1 = {bot: bot, message: message};
	bot.startPrivateConversation(message, function(res, dm){
		dm._bot = $_temp1.bot;
		dm._message = $_temp1.message;
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
					log_message(dm._message.user, dm._who, dm._msg, dm._url, dm._message.channel);
					dm.next();
				})
			})
		})
	});
});
sbot.hears(['^sayasurl$'], ["direct_message"], function(bot, message){
	$_temp1 = {bot: bot, message: message};
	bot.startPrivateConversation(message, function(res, dm){
		dm._bot = $_temp1.bot;
		dm._message = $_temp1.message;
		dm.ask('Say as who?', function(res, dm){
			dm._who = res.text;
			dm.next();
			dm.ask('Icon URL?', function(res, dm){
				dm._url = res.text;
				dm.next();
				dm.ask('Message?', function(res, dm){
					dm._msg = res.text;
					dm.next();
					dm.ask('Channel ID? Check http://scratchaterscomputerbot-mrcomputer1.rhcloud.com/id_finder/ or say @computerbot: channelid on the channel!', function(res, dm){
						dm._ch = res.text;
						dm._bot.say({
							text: dm._msg,
							username: dm._who,
							icon_url: dm._url,
							channel: dm._ch,
							as_user: false
						});
						log_message(dm._message.user, dm._who, dm._msg, dm._url, dm._ch);
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
	log_message(message.user, message.match[1], message.match[4].replace(/__/g, " "), message.match[2], message.match[3]);
});

sbot.hears(["^fun help$"], ["direct_mention", "direct_message"], function(bot, message){
	bot.reply(message, "kill \\*, blow up \\*, murder \\*, shoot \\*" + ", troll \\*, ban \\*, eat \\*, sell \\* for \\*, echo \\*");
});
// @ascom's hubot like stuff
sbot.hears(["kill (.*)", "blow up (.*)", "murder (.*)", "shoot (.*)"], ["mention", "direct_mention", "direct_message"], function(bot, message){
	var rand = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
	if(rand == 1){
		bot.reply(message, "Yes master! I shall do that!");
		bot.reply(message, message.match[1] + " has been killed!");
	}else if(rand == 2){
		bot.reply(message, "On it...");
		bot.reply(message, message.match[1] + " has been eliminated!");
	}
});
sbot.hears(["start a war with (.*)", "start a (.*) war with (.*)"], ["mention", "direct_mention", "direct_message"], function(bot, message){
	var rand = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
	if(message.match.length == 2){
		if(rand == 1){
			bot.reply(message, "Starting a war with " + message.match[1]);
			bot.reply(message, message.match[1] + " has sent an army of 1 million highly trained Scratch Cats!");
		}else if(rand == 2){
			bot.reply(message, "I don't want do start a war! Are you crazy! Starting a war with " + message.match[1] + " will get you killed!");
		}
	}else if(message.match.length == 3){
		if(rand == 1){
			bot.reply(message, "Starting a " + message.match[1] + " war with " + message.match[2]);
			bot.reply(message, message.match[2] + " has sent an army of 1 million highly trained and protected Gobos!");
		}else if(rand == 2){
			bot.reply(message, "I don't want do start a war! Are you crazy! Starting a " + message.match[1] + "war with " + message.match[2] + " will get you killed!");
		}
	}
});
sbot.hears(["troll (.*)"], ["mention", "direct_mention", "direct_message"], function(bot, message){
	var rand = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
	if(rand == 1){
		bot.reply(message, "Trolling " + message.match[1]);
		bot.reply(message, "@" + message.match[1] + " " + "@" + message.match[1] + " " + "@" + message.match[1] + " " + "@" + message.match[1] + " " + " :D");
		setTimeout(function(){
			bot.reply(message, "@" + message.match[1] + " " + "@" + message.match[1] + " " + "@" + message.match[1] + " " + "@" + message.match[1] + " " + " :D");
		}, 10000)
	}else if(rand == 2){
		bot.reply(message, "No! That might start a war! :open_mouth:");
	}
});
sbot.hears(["ban (.*)"], ["mention", "direct_mention", "direct_message"], function(bot, message){
	var rand = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
	if(rand == 1){
		bot.reply(message, "Banning " + message.match[1]);
		bot.reply(message, "Banned!");
	}else if(rand == 2){
		bot.reply(message, "No! They might shut me down :open_mouth:");
	}
});
sbot.hears(["eat (.*)"], ["mention", "direct_mention", "direct_message"], function(bot, message){
	var rand = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
	if(rand == 1){
		bot.reply(message, "Eating " + message.match[1]);
		var rnd = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
		if(rnd == 1){
			bot.reply(message, "Yum! I like " + message.match[1] + " soup");
		}else if(rnd == 2){
			bot.reply(message, "Yum! I like " + message.match[1] + " pie");
		}else if(rnd == 3){
			bot.reply(message, "Yum! " + message.match[1] + " tastes like chocolate");
		}else if(rnd == 4){
			bot.reply(message, "Yum! " + message.match[1] + " tastes like chicken");
		}else if(rnd == 5){
			bot.reply(message, "Yum! " + message.match[1] + " tastes like banana");
		}
		bot.reply(message, ":yum:");
	}else if(rand == 2){
		bot.reply(message, "Eating " + message.match[1]);
		bot.reply(message, "Yuck!");
	}
});
sbot.hears(["sell (.*) for (.*)"], ["mention", "direct_mention", "direct_message"], function(bot, message){
	var rand = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
	if(rand == 1){
		bot.reply(message, "Selling " + message.match[1] + " for " + message.match[2]);
		var rnd = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
		if(rnd == 1){
			bot.reply(message, "Sold " + message.match[1] + " on ebay for " + message.match[2]);
			bot.reply(message, ":moneybag:");
		}else if(rnd == 2){
			bot.reply(message, "Sold " + message.match[1] + " on amazon for " + message.match[2]);
			bot.reply(message, ":moneybag:");
		}else if(rnd == 3){
			bot.reply(message, "Sold " + message.match[1] + " to someone random");
			bot.reply(message, ":moneybag:");
		}else if(rnd == 4){
			bot.reply(message, "Setup a website and sold " + message.match[1] + " on it");
			bot.reply(message, ":moneybag:");
		}else if(rnd == 5){
			bot.reply(message, message.match[1] + " is waiting in storage");
		}
		bot.reply(message, ":money_mouth_face:");
	}else if(rand == 2){
		bot.reply(message, message.match[1] + " was stolen before it was sold");
		bot.reply(message, ":(");
	}
});
sbot.hears(["echo (.*)"], ["mention", "direct_mention", "direct_message"], function(bot, message){
	bot.reply(message, message.match[0].replace(/echo /g, ""));
});


// Old channel IDs
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
"If any ID is not working or a channel is missing then please report it by Direct Messaging @mrcomputer1 on the Scratch-ATers Slack";
// /Old channel IDS

var server = http.createServer(function(req, res){
	var url = req.url;
	if(url == "/"){
		res.writeHead(200);
		res.end("Welcome to ComputerBot!");
	}else if(url == "/health"){
		res.writeHead(200);
		res.end("Working well!");
	}else if(url == "/channel_ids/"){
		//res.setHeader('Content-Type', "text/html;charset=utf-8");
		res.setHeader("Location", "/id_finder/");
		res.writeHead(300);
		res.end(page_channel_ids);
	}else if(url == "/channel_ids/?stay=1"){
		res.setHeader('Content-Type', "text/html;charset=utf-8");
		res.writeHead(200);
		res.end(page_channel_ids);
	}else if(url == "/id_finder/"){
		fs.readFile("channels.html", function(err, data){
			if(err){
				res.setHeader("Content-Type", "text/html;charset=utf-8");
				res.writeHead(500);
				res.end("<h1>Something went wrong!</h1><pre>" + err + "</pre>");
				return;
			}
			
			res.setHeader('Content-Type', "text/html;charset=utf-8");
			res.writeHead(200);
			res.end(data);
		});
	}else if(url == "/chat-messages.log"){
		fs.readFile("chat-messages.log", function(err, data){
			if(err){
				res.writeHead(500);
				res.end("Could not load log file");
				return;
			}
			res.writeHead(200);
			res.end(data);
		})
	}
	else{
		res.writeHead(404);
		res.end("404 Not Found");
	}
}).listen(env.NODE_PORT || 3000, env.NODE_IP || "localhost");