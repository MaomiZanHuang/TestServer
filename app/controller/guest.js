const Controller = require('egg').Controller;
const _ = require('lodash/object');
const request = require('request-promise');
const {getShuoshuoSession, MD5} = require('../utils/index');
const moment = require('moment');
const UA = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 UBrowser/6.2.4094.1 Safari/537.36';
const Sequelize = require('sequelize');

const KLs = [
  '扩列了，可互赞，然后....没了(补充一下，我是颜控，丑拒)',
  '一起打王者不喽？！怀疑宇宙悄悄拦截了有人爱我的信号？？',
  '天气很暖，青桔短巷，话不多说15，暖心，沙雕，互赞+',
  '互赞(点赞不是十个的都是坏蛋点十个或者二十个的会回赞)，本人不冷，可以谈心，早上上学，在线秒回，听歌，王者，qq飞车都ok',
  '暖空间，聊天，17几人份的长谈，道三两句的晚安 惹多情的下乡，却轻易的走散',
  '养花养草造大船都可以的 陪你一起吧唧吧唧一起尬聊不要慌。。。咱也不知怎么说，咱也不敢问，cdx勿加，不删好友，要删绕道',
  '你好吖，既然刷到了我，不如交个朋友吧',
  '艾呀，居然让你看到了我，本人不高冷可以撩，cdx也ok，超级暖宝宝在此',
  '这里沙雕女孩未央鸭(05搭),我求求你们了秒删的，查户口的放过我吧，我只是个孩子(!真心不喜欢被粘着!),花草都可以养',
  '01年。貂蝉贼6不吹哈哈哈。扩列喔，愿被你温柔以待，嘻嘻波拒绝浏览g',
  'QQ扩列喽 互赞+暖说说+ 真诚的哦',
  '找个可以聊天的人，学生党，话痨，逗比，，，哥哥贫困户，没有男朋友，喜欢声音好听的+',
  '我的列表人不多，可是缺个你，缺一个温柔的你，无时无刻不包容我的你',
  '优质扩列，幸识，互赞10/20都会补上去的，K歌，王者，16以下绕道，重度精神洁癖，反手就是删',
  '文明交友，互赞呐，如果喜欢猫的话再好不过了，来我空间看看吧~~~',
  '扩列吗？嗨翻暑假的那种,扩列＋处关系＋养草＋养火花＋拜师＋什么什么都可以那种',
  '05女孩，沙雕瑶瑶在线陪聊来了就是宝贝交友+处姐妹+不处对象的男孩子+养草，养火+干啥都+ ♡小孩子要有小孩子的亚子快加我吧',
  '这里宛辞.混熟了话超多。平时就看看脆皮鸭，补补番。养草养火互赞+我，加了互相安利哇。在线等一个你♡',
  '扩列交友+，本人超好相处自带沙雕属性，不考虑一下吗？',
  '扩列吖，小哥哥小姐姐们留下QQ我来加吖，名片，说说互赞',
  '放假了，阔以波列表..养草+养火花+互赞+空间说说赞+……等（都阔以）处关系+坐等留QQ，我都会加的。',
  '这里德云女孩二二高质量扩列。y火花儿+y草草+巨轮+啥啥的+优质秒互赞+游戏开黑+nss+cgx+',
  '扩列，性格慢热，沙雕网友在线陪聊，暖说说+互赞+处关系性格超好不高冷，留下号码我来加你们，前面加上dd,或者符号不然话题会被删除🤗',
  '添加我全天给你秒瓒暖说说+赞空间+互赞+朋友+扩列+吃鸡王者＋小哥哥＋小姐姐＋交友＋聊天 处关系 养火花',
  '扩列扩列加我我们互暖说说互赞啦，本人沙雕属性，一名coser，bz京子，q号',
  '这林墨，年龄15，坐标魔都超甜，也超丧想找一大群宝贝回列表追番党，半古风，半腐女喜欢长板，没有其他爱好缺个男eve，有宝贝女eve喜欢绿谷天使，戳爷!不',
  '扩列嗷处朋友+处闺蜜处死党处CP嗷欢迎小哥哥小姐姐！！！这里泪儿眼熟下嗷～',
  '扩个列子忆透明coser绘画跳舞（这里指的是爱好不代表擅长bo）喜欢鬼狐天冲lovelive（全员吹）星空凛jojo黄金之风凹凸'
];

class GuestController extends Controller {
  async shortUrl(url) {
    var newurl = "https://sharechain.qq.com/e54437534e86166120bf17ce3c557983?t=" + Math.random();
    if (Math.random() > 0.5) {
      return newurl;
    }
    try {
      var res = await request({
        method: 'GET',
        uri: 'https://tb.am/action/json.php?source=1681459862&url_long='+url
      });
      
      if (typeof res == 'string') {
        res = JSON.parse(res);
      }

      if (res.urls) {
        newurl = res.urls[0] && res.urls[0].url_short;
      }
    } catch(err) {
    }
    return newurl;
  }
  // 免费赞(仅需传入部落号)
  async getLastPage() {
    var bid = this.ctx.query.bid || 408994;
    var r = Math.random();
    var options = {
      method: 'GET',
      uri: `https://buluo.qq.com/cgi-bin/bar/post/get_post_by_page?bid=${bid}&num=20&start=0&theme_max_ts=0&r=${r}`,
      headers: {
        'authority': 'buluo.qq.com',
        'method': 'GET',
        'path':`/cgi-bin/bar/post/get_post_by_page?bid=${bid}&num=10&start=30&theme_max_ts=0&r=${r}`,
        'scheme':'https',
        'accept':'application/json',
        // 'accept-encoding':'gzip, deflate, br',
        'accept-language':'zh-CN,zh;q=0.8,en;q=0.6',
        'cookie':'pgv_pvi=4295007232; pgv_si=s3655250944; _qpsvr_localtk=0.4446738644353607; ptisp=cnc; RK=js701oRMQo; ptcz=21f57a598eb8f01be17656dc2dee90644dd566f6b03b639e29a005f6e43753f5; uin=o1540811286; skey=@JMbIsKoRg; p_uin=o1540811286; pt4_token=onpE1GXPPTn6hKzsu7DXG1NjtD9m*C4i8Wjke-zpXEo_; p_skey=jwPX5srEOzrql*Nye9mQbF6sBF1ipMJc6ISrIhIBGHM_; enc_uin=tHouEJiiIHatRbQtlw_9Ew; buluo_version=1544000693348; os=1; network_type=0; offline=0; _screenW=414; _screenH=736; _devicePixelRatio=3',
        'referer':`https://buluo.qq.com/mobile/barindex.html?_wv=1027&_bid=128&from=pc&bid=${bid}`,
        'user-agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        'x-requested-with':'XMLHttpRequest'
      }
    }

    var res = await request(options);
    if (res.retcode) {
      return this.ctx.body = res;
    }

    if (typeof res === 'string') {
      res = JSON.parse(res);
    }

    var qqs = [];
    var _qqs = [];

    // gender 1-男 2-女
    // age  year
    //
    var reg_qq = /[0-9\s]{8,10}/;
    var reg_has_num = /\d{5,}/;
    var contents = [];
    var posts = res.result.posts;
    for(let i = 0; i < posts.length; i++) {
      let post = posts[i].post.content;
      let comments = posts[i].comment_info;
      if (comments && comments.length) {
        contents = [...contents, ...comments.map(c => c.comment.content)];
      }
      contents = [...contents, post];
    }

    for(let i = contents.length-1; i > 0; i--) {
      let c = contents[i];
      if (typeof c !== 'string') {
        continue;
      }
  
      if (c.match(reg_has_num)) {
        let qq = c.match(reg_qq);
        if (qq && !qqs.includes(qq[0])) {
          qqs.push(qq[0].trim());
        } else {
          _qqs.push(c);
        }
      }
    }

    var match_qqs = await this.app.model.QqEmail.findAll({where: {
      qq: {
        [Sequelize.Op.in]: qqs
      }
    }
    });

    // 找出差异化
    var diff_qqs = qqs.filter(qq => !match_qqs.map(e => e.dataValues.qq).includes(qq));
    var records = diff_qqs.map(qq => ({
      qq,
      is_send: 0,
      tag: 'zan',
      time: moment().format('YYYY-MM-DD HH:mm:ss')
    }));
    if (records.length)
      this.app.model.QqEmail.bulkCreate(records);

    return this.ctx.body = {
      code: 1,
      msg: `已插入${records.length}条记录`
    }
  }

  async sendMail() {
    var mail_users = ['qq1', 'qq2', 'qq3', 'qq4'];
    var mails = mail_users.reduce((prev, next) => {
      return prev.concat(this.app.email.get(next));
    }, []);
    var rdx = Math.floor(Math.random() * mails.length);
    var client = mails[rdx];
    var user = client.options.auth.user;
    

    // 获取邮箱并发送
    var qq_email = await this.app.model.QqEmail.findAll({
      where: {
        is_send: 0
      },
      limit: 3
    });
    if (!qq_email || qq_email.length < 1) {
      return this.ctx.body = {
        code: 0,
        msg: '暂无邮箱可发~'
      };
    }
    
    var qqs = qq_email.map(q => q.dataValues.qq);
    var TITLES = ['QQ部落扩列', 'cqy', '扩列cdx', 'qq暖说说', '互赞', '扩列cqy+', '养草养火花', '加个好友吧', 'QAQ'];
    var idx_title = Math.floor(Math.random() * TITLES.length);
    var addr= qqs.map(q => q+'@qq.com').join(';'), title=qqs.join(',')+"你好吖，"+TITLES[idx_title]+"~~~";
    var kidx = Math.floor(Math.random()*KLs.length);
    var kl_content = KLs[kidx]+Math.random();
    var t = Math.random().toString(36);
    var short_url = await this.shortUrl("https://unblockcn.github.io/qq.html?t="+t);
    var content= `
    <html>
      <head>
      </head>
      <body>
      你好，${title}<br/>
        ${kl_content}
        <!------------${t}---------------><a href="${short_url}" style="display:block;line-height:30px">立即加我</a><!-----${t}---------->
      </body>
    </html>
    `;
    const mailOptions = {
      from: user,
      to: addr,
      subject: title,
      html: content
    };

    
    client.sendMail(mailOptions, (error, response) => {
        if (error) {
          console.log(error);
        } else {
          this.app.model.QqEmail.update({
            is_send: 1
          }, {where:{
            qq: {
              [Sequelize.Op.in]: qqs
            }
          }})
        }
        client.close();
    });

    return this.ctx.body = {
      code: 1,
      msg: '发送给'+addr+'成功！'
    };
  }
}

module.exports = GuestController;