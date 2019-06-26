const JWT = require('jwt-simple');
const request = require('request');

const SECRET_KEY = 'zanhuang';

var SHUOSHUO_SESSION = '';

const getShuoshuoSession = (flag) => {
  return new Promise((resolve, reject) => {
    // 默认直接使用上次的SESSION
    if (!flag) {
      return resolve(SHUOSHUO_SESSION);
    }
    console.log('session 已失效，正尝试重新登录获取session....');
    request({
      url: 'http://95.50qq.cn/index.php?m=Home&c=User&a=login&id=11165&goods_type=141',
      method: "POST",
      json: true,
      headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      form: { username: '非凡网络', username_password: 'Qq1234', user_remember: 1, id: '11165', goods_type: '141' } 
    }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        SHUOSHUO_SESSION = response.headers['set-cookie'][0].split(';')[0]+';';
        console.log('登录成功并重新设置了session:' + SHUOSHUO_SESSION);
        return resolve(SHUOSHUO_SESSION);
      } else {
        reject(SHUOSHUO_SESSION);
      }
    }); 
  })
}

// 数字补0
const fillNum = n => n > 9
  ? n + ''
  : '0' + n;

// 获取当前时间戳的unix,格式yyyyMMdd_8位时间戳
const getUid = () => {
  let d = new Date;
  let year = d.getFullYear();
  let month = fillNum(d.getMonth() + 1);
  let day = fillNum(d.getDate());
  return year + month + day + '_' + ((+d) + '').slice(-8);
}

// 创建加密的jwt数据
const createJWT = (user, role, expire) => {
  return JWT.encode({user, role, expire}, SECRET_KEY);
};

// 解密jwt数据返回
const parseJWT = sign => {
  return JWT.decode(sign, SECRET_KEY);
};

// 获取所有接口参数映射表
const getApiParamsAlias = () => {
  const alias = {
    qq: 'qq',
    need_num_0: 'amt',
    ksid: 'ksid'
  };
  return alias;
};

// MD5加密
const MD5 = str => {
  var crypto=require('crypto');
  var md5=crypto.createHash("md5");
  md5.update(str);
  return md5.digest('hex');
}

/**
 * 示例 function(res) {
 * res += 'a';
 * return res.status;
 * }
 */
const parseFunctionStr = str => {
  str = str.trim();
  var _prefix = str.match(/^function[\S|\s]+?{/);
  var prefix = _prefix[0];
  var param = prefix.replace(/^function\s*?\(/, '').replace(/\)\s*{$/, '').trim();
  var function_body = str.replace(prefix, '').replace(/}$/, '');
  return new Function(param, function_body);
}

const getClientIpFromXForwardedFor = value => {
  if (!(value)) {
      return null;
  }

  if (typeof value !== 'string') {
      return null;
  }

  const forwardedIps = value.split(',').map((e) => {
      const ip = e.trim();
      if (ip.includes(':')) {
          const splitted = ip.split(':');
          // make sure we only use this if it's ipv4 (ip:port)
          if (splitted.length === 2) {
              return splitted[0];
          }
      }
      return ip;
  });
  return forwardedIps.find(is.ip);
}

// 获取用户端IP
const getClientIp = req => {

  // Server is probably behind a proxy.
  if (req.headers) {
      
      // Standard headers used by Amazon EC2, Heroku, and others.
      if (req.headers['x-client-ip']) {
          return req.headers['x-client-ip'];
      }

      // Load-balancers (AWS ELB) or proxies.
      const xForwardedFor = getClientIpFromXForwardedFor(req.headers['x-forwarded-for']);
      if (xForwardedFor) {
          return xForwardedFor;
      }


      if (req.headers['cf-connecting-ip']) {
          return req.headers['cf-connecting-ip'];
      }

      // Fastly and Firebase hosting header (When forwared to cloud function)
      if (req.headers['fastly-client-ip']) {
          return req.headers['fastly-client-ip'];
      }

      // Akamai and Cloudflare: True-Client-IP.
      if (req.headers['true-client-ip']) {
          return req.headers['true-client-ip'];
      }

      // Default nginx proxy/fcgi; alternative to x-forwarded-for, used by some proxies.
      if (req.headers['x-real-ip']) {
          return req.headers['x-real-ip'];
      }

      if (req.headers['x-cluster-client-ip']) {
          return req.headers['x-cluster-client-ip'];
      }

      if (req.headers['x-forwarded']) {
          return req.headers['x-forwarded'];
      }

      if (req.headers['forwarded-for']) {
          return req.headers['forwarded-for'];
      }

      if (req.headers.forwarded) {
          return req.headers.forwarded;
      }
  }

  // Remote address checks.
  if (req.connection) {
      if (req.connection.remoteAddress) {
          return req.connection.remoteAddress;
      }
      if (req.connection.socket && req.connection.socket.remoteAddress) {
          return req.connection.socket.remoteAddress;
      }
  }

  if (req.socket && (req.socket.remoteAddress)) {
      return req.socket.remoteAddress;
  }

  if ((req.info) && (req.info.remoteAddress)) {
      return req.info.remoteAddress;
  }

  // AWS Api Gateway + Lambda
  if ((req.requestContext) && (req.requestContext.identity) && (req.requestContext.identity.sourceIp)) {
      return req.requestContext.identity.sourceIp;
  }

  return null;
}

const randomInt = (start, end) => {
  let gap = end - start;
  return start + Math.round(gap * Math.random());
}

const encrypt = (str, key) => {
  return str^key;
}


module.exports = {
  fillNum,
  getUid,
  createJWT,
  parseJWT,
  getApiParamsAlias,
  MD5,
  getShuoshuoSession,
  parseFunctionStr,
  getClientIp,
  encrypt,
  randomInt
};

      




