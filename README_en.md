# Telegram fast three robot
[![](https://img.shields.io/badge/Author-byprogram-orange.svg)](https://github.com/byprogram)
[![](https://img.shields.io/badge/version-1.0-brightgreen.svg)]([https://github.com/byprogram/telegram-kuaisan-bot])<br>
<br>
English | [简体中文](https://github.com/byprogram/telegram-kuaisan-bot-v1.0/blob/main/README.md)<br>
![gvwgr-kre33](https://user-images.githubusercontent.com/92509765/205933725-217c499c-779b-44e3-824d-e92fca217ab5.gif)

## Paid version (100USDT only)
- Support background management system, you can view all kinds of data<br>
- Support USDT self-service recharge and withdrawal, you can also choose manual recharge and withdrawal
- Support mainstream gameplay, such as big and small double straights vs leopards, etc.
- Support Canada 28 and Kuaisan games, and can also be connected to other games
- demo preview
    - [Background management system demo ](http://3.0.96.211/) `Username:admin Password:admin`<br>
    - [Kuaisan telegram group demo](https://t.me/+m8Ezr3RdrS9hNGI1)
    - [Canada 28 telegram Group Demo](https://t.me/+4Fi3FaxqMLo0Yzg1)
    - [USDT self-service deposit and withdrawal robot](https://t.me/czby_bot)
## Instructions
1.[Apply](https://t.me/BotFather) for a telegram robot and get the token<br>
2.Create a new telegram group, invite the robot into the group, and give administrator privileges<br>
3.Install [Node.js](https://nodejs.org/en/)and[MySQL](https://www.mysql.com/)<br>
4.Create a new MySQL database and import the telegram.sql file<br>
5.Modify `node index` Configure in the file, enter node indexthe startup<br>
```javascrit
/*Configuration Area Start*/
var pool = mysql.createPool({
    port:3306, //your mysql port
    user     : 'telegram', //your mysql username
    password : 'telegram', //your mysql password
    database : 'telegram', //your mysql database
});
var token = 'your bot token'; //your bot token
var chatid = 123456; //the group id
var periodTime = 10; //The interval between each lottery draw is 10 seconds by default
var inline_keyboard = [ // set Inlinekeyboard
    [{ text: 'Point statistics', callback_data: '1' },{ text: 'Long Dragon Statistics', callback_data: '2' }], 
    [{ text: 'Project introduction', callback_data: '3' ,url:"https://github.com/byprogram/telegram-kuaisan-bot-v1.0"}],
    [{ text: 'Contact Author', callback_data: '4' ,url:"https://t.me/zhangsan666888"}]
]
/*End of configuration area*/
```
## Exchange of technical questions
Telegram：[@byprogram](https://t.me/byprogram)
## Statement
This project is only for technical research, please do not use it for any commercial purposes, please do not use it for illegal purposes, if anyone does illegal things based on this, it has nothing to do with the author, hereby declares.
