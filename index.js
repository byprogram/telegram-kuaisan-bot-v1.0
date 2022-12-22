var TelegramBot = require('node-telegram-bot-api');
var mysql = require('mysql');

/*配置区开始*/
var pool = mysql.createPool({
    port:3306, //mysql端口
    user     : 'telegram', //mysql用户名
    password : 'telegram', //mysql密码
    database : 'telegram', //mysql数据库
});
var token = '5729674949:AAGTuC5kABOHS4w5uh4toOmQAeyy5LqHlYQ'; //机器人的token
var chatid = -1001836705519; //发送群或用户的id
var periodTime = 10; //每一期开奖的间隔，默认10秒
var inline_keyboard = [ //内联键盘
    [{ text: '点数统计', callback_data: '1' },{ text: '长龙统计', callback_data: '2' }], 
    [{ text: '项目介绍', callback_data: '3' ,url:"https://github.com/byprogram/telegram-kuaisan-bot-v1.0"}],
    [{ text: '联系作者', callback_data: '4' ,url:"https://t.me/byprogram"}]
]
/*配置区结束*/

/*创建实例对象开始*/
var bot = new TelegramBot(token, {polling: true});
/*创建实例对象结束*/

var resultCount = [
    {value :0},
    {value :0},
    {value :0},
    {value :0},
    {value :0},
    {value :0},
]
var resultdxds = {
    big:0,
    small:0,
    odd:0,
    even:0,
    baozi:0
}
var a, b, c;
var daxiao,danshuang;
var baozi;
var value;
var date;

/*监听新消息，回复群的ID*/
bot.on('message', (msg) => { 
    bot.sendMessage(chatid, `Hi,这个群的id是${msg.chat.id}`)
});

/*循环，掷骰子*/
setInterval(function() {
    bot.sendDice(chatid,{values: 1,emoji: '🎲'}).then(res =>{
        a = res.dice.value;
        bot.sendDice(chatid,{values: 1,emoji: '🎲'}).then(res =>{
            b = res.dice.value;
            bot.sendDice(chatid,{values: 1,emoji: '🎲'}).then(res =>{
                c = res.dice.value;
                value = a+b+c;
                /*初始化*/
                resultdxds = {
                    big:0,
                    small:0,
                    odd:0,
                    even:0,
                    baozi:0
                }
                baozi = "";
                daxiao = "";
                danshuang = "";
                if (value==3 || value==18) { //如果是豹子
                    resultdxds.baozi = 1;
                    baozi = "豹子";
                } else {
                    /*大小*/
                    if(value>10){
                        resultdxds.big = 1;
                        daxiao = "大";
                    }
                    if(value<=10){
                        resultdxds.small = 1;
                        daxiao = "小";
                    } 
                    /*单双*/
                    if(value%2==1){
                        resultdxds.odd = 1;
                        danshuang = "单";
                    }
                    if(value%2==0){
                        resultdxds.even = 1;
                        danshuang = "双";
                    }
                }
                pool.getConnection(function(err, connection) {
                    if (err) throw err;
                    connection.query(`INSERT INTO result (id , one ,two ,three ,big ,small ,odd ,even ,baozi ) VALUES ("${getResultID()}",${a},${b},${c},${resultdxds.big},${resultdxds.small},${resultdxds.odd},${resultdxds.even},${resultdxds.baozi})`,(error, result)=> {
                        if (error) throw error;
                        connection.destroy();
                    });
                });
                bot.sendMessage(chatid, `${getResultID()}期开奖\n${a}+${b}+${c}=${a+b+c} (${baozi}${daxiao} ${danshuang})`,{
                    reply_markup: JSON.stringify({
                      inline_keyboard: inline_keyboard
                    })
                });
            }); 
        }); 
    });
},periodTime*1000)

/*监听内联键盘*/
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    switch (callbackQuery.data) {
        case "1":
            resultCount = [
                {value :0},
                {value :0},
                {value :0},
                {value :0},
                {value :0},
                {value :0},
            ]
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                var sql = `SELECT * FROM result ;`;
                connection.query(sql,(error, result)=> {
                    connection.destroy();
                    if (error) throw error;
                    for (let index = 0; index < result.length; index++) {
                        resultCount[result[index].one-1].value++;
                        resultCount[result[index].two-1].value++;
                        resultCount[result[index].three-1].value++;
                    }
                    bot.sendMessage(chatid, `1点:${resultCount[0].value}次\n2点:${resultCount[1].value}次\n3点:${resultCount[2].value}次\n4点:${resultCount[3].value}次\n5点:${resultCount[4].value}次\n6点:${resultCount[5].value}次\n`);
                });
                
            });
            break;
        case "2":
            var dxds = [
                {big:0,last:0,longest:0,id:""},
                {small:0,last:0,longest:0,id:""},
                {odd:0,last:0,longest:0,id:""},
                {even:0,last:0,longest:0,id:""},
            ]
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(`SELECT * FROM result ;`,(error, result)=> {
                    connection.destroy();
                    if (error) throw error;
                    for (let index = 0; index < result.length; index++) {
                        if (result[index].big == 1 && dxds[0].last == 1) {
                            dxds[0].last = result[index].big;
                            dxds[0].big++;
                            if (dxds[0].big > dxds[0].longest) {
                                dxds[0].longest = dxds[0].big;
                                dxds[0].id = result[index].id;
                            }
                        }else if(result[index].big == 1 && dxds[0].last == 0){
                            dxds[0].last = result[index].big;
                            dxds[0].big++;
                            if (dxds[0].big > dxds[0].longest) {
                                dxds[0].longest = dxds[0].big;
                                dxds[0].id = result[index].id;
                            }
                        }else if(result[index].big == 0){
                            dxds[0].last = 0;
                            dxds[0].big = 0;
                        }

                        if (result[index].small == 1 && dxds[1].last == 1) {
                            dxds[1].last = result[index].small;
                            dxds[1].small++;
                            if (dxds[1].small > dxds[1].longest) {
                                dxds[1].longest = dxds[1].small;
                                dxds[1].id = result[index].id;
                            }
                        }else if(result[index].small == 1 && dxds[1].last == 0){
                            dxds[1].last = result[index].small;
                            dxds[1].small++;
                            if (dxds[1].small > dxds[1].longest) {
                                dxds[1].longest = dxds[1].small;
                                dxds[1].id = result[index].id;
                            }
                        }else if(result[index].small == 0){
                            dxds[1].last = 0;
                            dxds[1].small = 0;
                        }

                        if (result[index].odd == 1 && dxds[2].last == 1) {
                            dxds[2].last = result[index].odd;
                            dxds[2].odd++;
                            if (dxds[2].odd > dxds[2].longest) {
                                dxds[2].longest = dxds[2].odd;
                                dxds[2].id = result[index].id;
                            }
                        }else if(result[index].odd == 1 && dxds[2].last == 0){
                            dxds[2].last = result[index].odd;
                            dxds[2].odd++;
                            if (dxds[2].odd > dxds[2].longest) {
                                dxds[2].longest = dxds[2].odd;
                                dxds[2].id = result[index].id;
                            }
                        }else if(result[index].odd == 0){
                            dxds[2].last = 0;
                            dxds[2].odd = 0;
                        }

                        if (result[index].even == 1 && dxds[3].last == 1) {
                            dxds[3].last = result[index].even;
                            dxds[3].even++;
                            if (dxds[3].even > dxds[3].longest) {
                                dxds[3].longest = dxds[3].even;
                                dxds[3].id = result[index].id;
                            }
                        }else if(result[index].even == 1 && dxds[3].last == 0){
                            dxds[3].last = result[index].even;
                            dxds[3].even++;
                            if (dxds[3].even > dxds[3].longest) {
                                dxds[3].longest = dxds[3].even;
                                dxds[3].id = result[index].id;
                            }
                        }else if(result[index].even == 0){
                            dxds[3].last = 0;
                            dxds[3].even = 0;
                        }
                    }
                    bot.sendMessage(chatid, `大：${dxds[0].longest}次,${dxds[0].id}期\n小：${dxds[1].longest}次,${dxds[1].id}期\n单：${dxds[2].longest}次,${dxds[2].id}期\n双：${dxds[3].longest}次,${dxds[3].id}期\n`);
                });
            });
            break;
        default:
            break;
    }
});

/*获取开奖的期数*/
function getResultID() {
    date = new Date();
    return `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}${date.getHours()*60+date.getMinutes()}${(date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds())}`
}
