import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path'
import license from 'spdx-license-list/licenses/MIT.json';
import gitignore from 'gitignore';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

const access = promisify(fs.access);
const writeFile = promisify(fs.writeFile);
const copy = promisify(ncp);
const writeGitignore = promisify(gitignore.writeFile);

async function copyTemplateFile(options) {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false,
    });
}

async function initGit(options) {
    const result = await execa('git', ['init'], {
        cwd: options.targetDirectory
    });
    if (result.failed) {
        return Promise.reject(new Error('Failed to initialize git.'));
    }
}

async function createGitignore(options) {
    const file = fs.createWriteStream(
        path.join(options.targetDirectory, '.gitignore'),
        { flags: 'a' }
    );
    return writeGitignore({
        type: 'Node',
        file: file,
    });
}

async function createLicense(options) {
    const targetPath = path.join(options.targetDirectory, 'LICENSE');
    const licenseContent = license.licenseText
      .replace('<year>', new Date().getFullYear())
      .replace('<copyright holders>', `${options.name} (${options.email})`);
    return writeFile(targetPath, licenseContent, 'utf8');
}

export async function createProject(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
        email: '???',
        name: 'Pixelwarp',
    };

    const currentFileUrl = import.meta.url;
    const templateDir = path.resolve(
        new URL(currentFileUrl).pathname.substring(new URL(currentFileUrl).pathname.indexOf('/')+1),
        '../../templates',
        options.template.toLowerCase()
    );
    options.templateDirectory = templateDir;

    try {
        await access(templateDir, fs.constants.R_OK);
    } catch (err) {
        console.error('%s Invalid template name', chalk.red.bold('ERROR'));
        process.exit(1);
    }

    const tasks = new Listr([
        {
            title: 'Copying project files',
            task: () => copyTemplateFile(options),
        },
        {
            title: 'Creating gitignore',
            task: () => createGitignore(options),
        },
        {
            title: 'Creating license',
            task: () => createLicense(options),
        },
        {
            title: 'Initialize git',
            task: () => initGit(options),
            enabled: () => options.git
        },
        {
            title: 'Installing dependencies',
            task: () => projectInstall({
                cwd: options.targetDirectory
            }),
            skip: () => !options.runInstall ? 'Pass --install to automatically install dependencies' : undefined,
        },
    ]);

    await tasks.run();

    console.log(`%s Project is ready`, chalk.green.bold('DONE'));
    return true;
}