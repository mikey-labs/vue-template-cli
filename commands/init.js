import chalk from 'chalk';
import inquirer from 'inquirer';
import * as path from 'node:path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { Platforms } from '../config/constant.js';
import ora from 'ora';

const __templatesDir = fileURLToPath(
  path.join(import.meta.url, '../../templates')
);
const createProjectName = async () => {
  chalk.green('Initializing new project...');
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: 'my-project'
    }
  ]);
  const projectPath = path.join(process.cwd(), name);
  if (fs.pathExistsSync(projectPath)) {
    throw new Error('Directory "test" already exists.');
  }
  await fs.mkdirs(projectPath);
  console.log(chalk.green(`Project directory '${name}' created.`));
  return projectPath;
};
const createTemplate = async (sourcePath) => {
  const { platform } = await inquirer.prompt([
    {
      type: 'list',
      name: 'platform',
      message: 'Choose a framework platform:',
      default: 'App',
      choices: Platforms
    }
  ]);
  const spinner = ora({
    text: chalk.blue('Generate...'),
    spinner: 'dots' // 可选的加载动画样式
  });
  await fs.copy(path.join(__templatesDir, platform), sourcePath);
  spinner.clear();
  console.log(chalk.green(`Generate successfully`));
};
export default async () => {
  let projectPath = '';
  try {
    projectPath = await createProjectName();
    await createTemplate(projectPath);
  } catch (err) {
    if (projectPath) {
      await fs.remove(projectPath);
    }
    console.log(chalk.red('Cli error: ' + (err.message || '').split('\n')[0]));
    process.exit(0);
  }
};
