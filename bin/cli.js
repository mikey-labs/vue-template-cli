#!/usr/bin/env node
import {Command} from 'commander'
import initCommand from '../commands/init.js'

const program = new Command();

program
  .version('1.0.0')
  .description('A vue CLI framework template');

program
  .command('init')
  .description('Initialize a new project')
  .action(initCommand);

program.parse(process.argv);
