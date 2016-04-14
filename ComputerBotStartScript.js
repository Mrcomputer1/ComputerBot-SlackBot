/*
 * ComputerBot
 * ------------------
 * GitHub: https://github.com/Mrcomputer1/ComputerBot
 * Issues: https://github.com/Mrcomputer1/ComputerBot/issues
 * License: MIT License (See LICENSE file)
 * -----------------
 * This file is used to restart the bot
*/

var exec = require('child_process').exec;

setTimeout(function(){
	exec("node ./ComputerBot.js");
}, 4000);