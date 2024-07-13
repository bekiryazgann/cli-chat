import blessed, { Widgets } from 'blessed';
import moment from 'moment';
import chalk from 'chalk';
import {getRandomMessage} from "./src/utils";

type BlessedScreen = Widgets.Screen;
type BlessedBox = Widgets.BoxElement;
type BlessedTextbox = Widgets.TextboxElement;
type BlessedList = Widgets.ListElement;

const screen: BlessedScreen = blessed.screen({
    smartCSR: true,
    title: 'CLI Chat Application'
});

if (typeof screen.height !== "number" && typeof screen.width !== "number"){
    process.exit(0);
}

const logBoxWidth: string = '80%';
const logBoxHeight: string = '84%';
const infoAreaHeight: number = 3;

const logBoxLeft: number = Math.round((screen.width * 20) / 100);
const logBoxTop: number = infoAreaHeight;
const inputBoxLeft: number = logBoxLeft;
const inputBoxBottom: number = 0;

const statusBox: BlessedBox = blessed.box({
    top: 0,
    left: '20%',
    width: '20%',
    height: infoAreaHeight,
    align: 'left',
    content: chalk.bold.green('Write Mode'),
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: 'green'
        }
    }
});

const usernameBox: BlessedBox = blessed.box({
    parent: screen,
    top: 0,
    left: '40%',
    width: '20%',
    height: infoAreaHeight,
    label: chalk.bold.green('Username'),
    content: chalk.bold.green('<username>'),
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: 'green'
        }
    }
});

const dateBox: BlessedBox = blessed.box({
    parent: screen,
    top: '0',
    left: '60%',
    width: '20%',
    height: infoAreaHeight,
    label: chalk.bold.green('Date'),
    content: chalk.bold.green(moment().format('YYYY-MM-DD HH:mm:ss')),
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: 'green'
        }
    }
});

const activeUsersBox: BlessedBox = blessed.box({
    parent: screen,
    top: 0,
    left: '80%',
    width: '20%',
    height: infoAreaHeight,
    label: chalk.bold.green('Active Users'),
    content: chalk.bold.green('5'),
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: 'green'
        }
    }
});

const logBox: BlessedBox = blessed.box({
    top: logBoxTop,
    left: logBoxLeft,
    width: logBoxWidth,
    height: logBoxHeight,
    label: chalk.bold.green('Messages'),
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: 'green'
        }
    },
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
        ch: ' ',
        track: {
            bg: 'green'
        },
        style: {
            inverse: true
        }
    },
    keys: true,
    vi: true
});

const input: BlessedTextbox = blessed.textbox({
    bottom: inputBoxBottom,
    left: inputBoxLeft,
    width: '80%',
    height: '11%',
    label: chalk.bold.green('Write a message'),
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: 'green'
        }
    },
    inputOnFocus: true
});

const userManual: BlessedBox = blessed.box({
    top: logBoxTop,
    left: logBoxLeft,
    width: logBoxWidth,
    height: screen.height - infoAreaHeight,
    label: chalk.bold.green('User Manual'),
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: 'green'
        }
    },
    content: `
Welcome to CLI Chat Application!

Instructions: 
- Use arrow keys to navigate.
- Press Enter to select.

Features:
- Username display: Shows the current username.
- Date display: Displays the current date and time.
- Messages log: Displays all messages exchanged.
- Input area: Allows you to type and submit messages.

CLI Chat Application is an open-source project developed using ChatGPT.

Press ESC to return to the menu.`,
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
        ch: ' ',
        track: {
            bg: 'green'
        },
        style: {
            inverse: true
        }
    },
    keys: true,
    vi: true,
    hidden: true
});

const menu: BlessedList = blessed.list({
    top: 0,
    left: 0,
    width: Math.round((screen.width * 20) / 100),
    height: screen.height,
    label: chalk.bold.green('Command Bar'),
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: 'green'
        },
        selected: {
            bg: 'green',
            fg: 'black'
        },
        item: {
            fg: 'green',
            bg: 'black'
        }
    },
    keys: true,
    vi: true,
    items: [
        chalk.bold.green('Messages'),
        chalk.bold.green('Write a message'),
        chalk.bold.green('User Manual'),
        chalk.bold.red('Exit')
    ]
});

screen.append(logBox);
screen.append(input);
screen.append(menu);
screen.append(usernameBox);
screen.append(dateBox);
screen.append(activeUsersBox);
screen.append(userManual);
screen.append(statusBox);

const updateStatus = (index: number): void => {
    switch (index) {
        case 0:
            statusBox.setContent(chalk.bold.green('Navigation Mode'));
            break;
        case 1:
            statusBox.setContent(chalk.bold.green('Write Mode'));
            break;
        case 2:
            statusBox.setContent(chalk.bold.green('Documentation Mode'));
            break;
        default:
            statusBox.setContent(chalk.bold.green('Command Mode'));
            break;
    }
    screen.render();
};

const showAlert = (message: string): void => {
    const alertBox: BlessedBox = blessed.box({
        top: 1,
        right: 0,
        width: 'shrink',
        height: 3,
        content: message,
        tags: true,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            bg: 'red',
            border: {
                fg: 'red'
            }
        }
    });

    screen.append(alertBox);
    screen.render();

    setTimeout(() => {
        alertBox.destroy();
        screen.render();
    }, 5000);
};



const sendMessage = (text: string): void => {
    if (text.trim().length === 0) {
        showAlert('Cannot send empty message.');
        return;
    }

    const timestamp: string = moment().format('MM.DD HH:mm');
    const username: string = '<username>';
    const formattedTimestamp: string = chalk.white(timestamp);
    const formattedUsername: string = chalk.blue.bold(username);
    const formattedMessage: string = chalk.hex('#0e6b0e')(text);
    const message: string = `${formattedTimestamp} ${formattedUsername} : ${formattedMessage}`;

    logBox.insertBottom(message);
    screen.render();
}

input.on('submit', (text: string) => {
    sendMessage(text)
    input.clearValue();
    input.focus();
    logBox.scrollTo(logBox.getScrollHeight());
});

menu.on('select', (item: BlessedBox, index: number): void => {
    switch (index) {
        case 0:
            logBox.show();
            input.show();
            userManual.hide();
            updateStatus(index);
            logBox.focus();
            screen.render();
            break;
        case 1:
            logBox.show();
            input.show();
            userManual.hide();
            updateStatus(index);
            input.focus();
            screen.render();
            break;
        case 2:
            logBox.hide();
            input.hide();
            userManual.show();
            updateStatus(index);
            userManual.focus();
            screen.render();
            break;
        case 3:
            return process.exit(0);
    }
});

userManual.key(['escape'], (): void => {
    menu.emit('select', menu.getItemIndex(menu.selected));
});

screen.key(['escape'], (): void => {
    menu.focus();
});

screen.key(['q', 'C-c'], (): void => {
    return process.exit(0);
});

screen.render();
