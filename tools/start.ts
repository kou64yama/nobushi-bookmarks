import path from 'path';
import cp from 'child_process';
import webpack from 'webpack';
import run from './run';
import clean from './clean';
import copy from './copy';
import webpackConfig from './webpack.config';

const enableInspect = process.argv.includes('--inspect');
const electron = path.join(
  __dirname,
  '../node_modules/.bin',
  process.platform.startsWith('win') ? 'electron.cmd' : 'electron',
);

// https://webpack.js.org/configuration/watch/#watchoptions
const watchOptions = {
  // Watching may not work with NFS and machines in VirtualBox
  // Uncomment next line if it is your case (use true or interval in milliseconds)
  // poll: true,
  // Decrease CPU or memory usage in some file systems
  // ignored: /node_modules/,
};

let app: cp.ChildProcess | null = null;

async function runApp() {
  if (app) return app;

  app = cp.spawn(electron, [...(enableInspect ? ['--inspect'] : []), 'build'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  });
  app.once('exit', async code => {
    app = null;
    if (code) process.exit(code);
    await run(runApp);
  });
  return app;
}

async function start() {
  process.argv.push('--watch');

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

  await run(runApp);
}

export default start;
