import { promises } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import render from './render.mjs';

const forbiddenDirs = ['node_modules'];

class Runner {
  constructor() {
    this.testFiles = [];
  }

  async runTest() {
    for (let file of this.testFiles) {
      console.log(chalk.gray(`---- ${file.shortName}`));

      global.render = render;

      const beforeEaches = [];
      global.beforeEach = (fn) => {
        beforeEaches.push(fn);
      };

      global.it = async (desc, fn) => {
        beforeEaches.forEach(func => func());
        try {
         await fn();
          console.log(chalk.green('\t',`Ok - ${desc}`));
        } catch (err) {
          const message = err.message.replace(/\n/g, '\n\t\t');
          console.log(chalk.red('\t',`X - ${desc}`));
          console.log(chalk.red('\t', message));
        }
      };

      try {
        import(file.name);
      } catch (err) {
        console.log(chalk.red('X - Error Loading File', file.name));
        console.log(err);
      }
    }
  }

  async collectFiles(targetPath) {
    const files = await promises.readdir(targetPath);

    for (const file of files) {
      const filePath = join(targetPath, file);
      const stats = await promises.lstat(filePath);

      if (stats.isFile() && file.includes('.test.js')) {
        this.testFiles.push({ name: filePath, shortName: file});
      } else if (stats.isDirectory() && !forbiddenDirs.includes(file)) {
        const childFiles = await promises.readdir(filePath);
        files.push(...childFiles.map(f => join(file, f)));
      }
    }
  }
}

export default Runner;