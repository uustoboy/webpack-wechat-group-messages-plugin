const { execSync } = require('child_process');
const axios = require('axios');
const moment = require('moment');

let webhookKey = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=';
const authorInfo = execSync(
  `git config --get user.name`,
  { encoding: 'utf-8' }
);

moment.locale('zh-cn', {
  months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD',
    LL: 'YYYY年MM月DD日',
    LLL: 'YYYY年MM月DD日Ah点mm分',
    LLLL: 'YYYY年MM月DD日ddddAh点mm分',
    l: 'YYYY-M-D',
    ll: 'YYYY年M月D日',
    lll: 'YYYY年M月D日 HH:mm',
    llll: 'YYYY年M月D日dddd HH:mm'
  }
});
var dateTime = moment().format("llll");

let endAuthor = authorInfo.replace(/[\r\n]/g, "");
if (!endAuthor) {
  endAuthor = '未知作者';
}

function sendMarkdownTextToEnterpriseWeChatGroup (key, mdTpl = '') {
  const url = webhookKey + key;
  const data = {
    msgtype: 'markdown',
    markdown: {
      content: mdTpl,
    },
  };
  return axios({
    url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  });
}

class WebpackWechatGroupMessagesPlugin {
  options = {}
  // 构造函数
  constructor(options) {
    this.options = options;
  }
  // 应用函数
  apply (compiler) {
    compiler.hooks.done.tap('MyPlugin', stats => {
      if (!this.options.key) {
        return;
      }
      let endUseridLine = '';
      if (this.options.userid && Array.isArray(this.options.userid)) {
        let showUserid = '';
        let userid = this.options.userid;
        for (let i = 0; i < userid.length; i++) {
          showUserid += `<@${userid[i]}>`;
        }
        endUseridLine = `>${showUserid}`;
      }
      if (this.options.author) {
        endAuthor = this.options.author;
      }
      let endAuthorLine = '';

      let endTitleLine = '';
      if (this.options.name) {
        endTitleLine += `${this.options.name}`;
      }
      if (this.options.version) {
        endAuthorLine = `> 【打包版本】 <font color=\"info\">${this.options.version}</font>`;
      }
      if (!endTitleLine) {
        endTitleLine = '未知项目';
      }
      let endDescLine = '';
      if (this.options.desc) {
        endDescLine = `> 【版本描述】 <font color=\"info\">${this.options.desc}</font>`;
      }
      let mdTpl = `**<font color=\"warning\">${endTitleLine}打包上线</font>**，请注意。\n> 【打包者】 <font color=\"info\">${endAuthor}</font>\n`;
      if (endAuthorLine) {
        mdTpl += `${endAuthorLine}\n`;
      }
      if (endDescLine) {
        mdTpl += `${endDescLine}\n`;
      }
      mdTpl += `> 【打包时间】  <font color =\"comment\">${dateTime}</font>\n`;
      if (endUseridLine) {
        mdTpl += `${endUseridLine} `;
      }
      if (this.options.mdText) {
        mdTpl = this.options.mdText;
      }
      if (this.options.env || !this.options.hasOwnProperty('env')) {
        sendMarkdownTextToEnterpriseWeChatGroup(this.options.key, mdTpl);
      }
    });
  }
}

module.exports = WebpackWechatGroupMessagesPlugin;
