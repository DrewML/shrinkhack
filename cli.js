#!/usr/bin/env node

const shear = require('./');
const rimraf = require('rimraf');
const { green, red } = require('chalk');

function run(cb, success = [], fail = []) {
    const extraneousList = shear.getRawExtraneousList();
    const extraneousPkgs = shear.parseExtraneous(extraneousList);

    if (!extraneousPkgs.length) {
        cb(success, fail);
    }

    // lol, gross, but ¯\_(ツ)_/¯
    let counter = 0;

    extraneousPkgs.forEach(pkg => {
        rimraf(pkg.path, { disableGlob: false }, (err) => {
            (err ? fail : success).push(pkg);
            if (++counter === extraneousPkgs.length) {
                run(cb, success, fail);
            }
        });
    });
}

run((success, fail) => {
    // TODO: Add verbose option to list packages pruned
    console.log(green(`${success.length} package(s) pruned`));
    if (fail.length) console.log(red(`Failed pruning ${fail.length} package(s)`))
});
