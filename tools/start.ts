import path from 'path';
import cp from 'child_process';
import webpack from 'webpack';
import run from './run';
import clean from './clean';
import copy from './copy';
import webpackConfig from './webpack.config';

const electron = path.join(
  __dirname,
  process.platform.startsWith('win')
    ? '../node_modules/.bin/electron.cmd'
    : '../node_modules/.bin/electron',
);

// https://webpack.js.org/configuration/watch/#watchoptions
const watchOptions = {
  // Watching may not work with NFS and machines in VirtualBox
  // Uncomment next line if it is your case (use true or interval in milliseconds)
  // poll: true,
  // Decrease CPU or memory usage in some file systems
  // ignored: /node_modules/,
};

process.argv.push('--watch');

async function start() {
  await run(clean);
  await run(copy);

  await new Promise<webpack.Stats>((resolve, reject) =>
    webpack(webpackConfig as webpack.Configuration[]).watch(
      watchOptions,
      (err, stats) => {
        if (err) {
          return reject(err);
        }

        console.info(stats.toString(webpackConfig[0].stats));
        if (stats.hasErrors()) {
          return reject(new Error('Webpack compilation errors'));
        }

        resolve(stats);
      },
    ),
  );

  let app: cp.ChildProcess | null = null;
  (function spawn() {
    app = cp.spawn(electron, ['build'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
    });
    app.once('close', code => {
      if (code) process.exit(code);
      spawn();
    });
  })();
}

export default start;
