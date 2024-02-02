import welcome from 'cli-welcome';
import unhandled from 'cli-handle-unhandled';
import pkg from '../package.json' assert { type: 'json' };

export default ({ clear = true }) => {
    unhandled();

    welcome({
        title: `BotBeam`,
        tagLine: `by Janith Hathnagoda`,
        description: pkg.description,
        version: pkg.version,
        bgColor: '#36BB09',
        color: '#000000',
        bold: true,
        clear
    });
};
