const rimraf = require('rimraf');
const { execSync } = require('child_process');

module.exports = {
    getRawExtraneousList() {
        try {
            execSync('npm list', {
                encoding: 'utf8',
                stdio: ['ignore', 'ignore', 'pipe']
            });
            return '';
        } catch (err) {
            return err.message;
        }
    },

    parseExtraneous(str) {
        const extraneousMsgs = str.split('\n').filter(msg => msg.includes('extraneous: '));
        return extraneousMsgs.map(msg => {
            const [, name, version, path] = msg.match(/extraneous:\s+([@\w-/.]+)@(.+)\s(.+)/);
            return { name, version, path }
        });
    }
};
