### webpack-wechat-group-messages-plugin
___

给企业微信群发送markdown消息
```
  npm i -D webpack-wechat-group-messages-plugin 
```
配合vue.config.js使用
```
  const webpackWechatGroupMessagesPlugin = require('webpack-wechat-group-messages-plugin');
  module.exports = defineConfig({
    chainWebpack: config => {
      config.plugin('webpackWechatGroupMessagesPlugin').use(webpackWechatGroupMessagesPlugin, [{
        'env': false,  //非必填,手动判断是否发消息;
        'name': 'xxx',//必填,打包项目名;
        'version': 'xxxx',//非必填,打包版本;
        'author': 'xxxx',//非必填,打包作者,默认取git用户名;
        'desc': 'xxx',//非必填,上线描述;
        'key': 'xxxx', //必填,企业微信群webhooks的key;
        'userid': ['xxxxx'] //非必填,需要通知人员;
      }])
    }
  });
```