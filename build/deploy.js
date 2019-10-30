const scpClient = require('scp2');
const ora = require('ora');
const chalk = require('chalk');
const Client = require('ssh2').Client;
const pack = require('../package.json');

const server_config = {
  dev: {
    host: "", // host
    port: "", // 端口
    username: "", // 用户名
    password: "" // 密码
  },
};

const getTime = () => {
  const time = new Date()
  const year = time.getFullYear()
  const mon = time.getMonth() + 1
  const day = time.getDate()
  const hour = time.getHours()
  const min = time.getMinutes()
  const second = time.getSeconds()
  return `${year}-${mon}-${day} ${hour}:${min}:${second}`
}

const spinner = ora('正在发布到' + (process.env.env_config === 'dev' ? 'dev' : 'test') + '服务器...');
/*
 *  rm -rf 删除太危险
 * */
let conn = new Client();
conn
  .on('ready', function () {
    conn.exec(`rm -rf /home/resico-it/project/front/${pack.name}`, function (err, stream) {
      if (err) throw err;
      stream.on('close', function (code, signal) {
        spinner.start();
        scpClient.scp(
          './dist',
          {
            ...server_config[process.env.env_config],
            path: `/home/resico-it/project/front/${pack.name}`
          },
          function (err) {
            spinner.stop();
            if (err) {
              console.log(chalk.red('发布失败.\n'));
              throw err;
            } else {
              console.log(chalk.green('Success! 成功发布到'));
              console.log(chalk.green(`Complete Time：${getTime()}`));
            }
          }
        );
        conn.end();
      }).on('data', function (data) {
        console.log('STDOUT: ' + data);
      })
        .stderr.on('data', function (data) {
        console.log('STDERR: ' + data);
      });
    });
  })
  .connect(server_config[process.env.env_config]);
