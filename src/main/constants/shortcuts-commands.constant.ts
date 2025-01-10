interface ShortcutsCommands {
  winOs: string
  macOs: string
  linuxOs: string
}

// validar esses comandos. é tudo fake por enquanto (WIP)
const START_WORKING_HOURS: ShortcutsCommands = {
  winOs: 'Alt+Cmd+E',
  macOs: 'Command+Shift+I',
  linuxOs: 'Alt+Cmd+I'
}

const FINISH_WORKING_HOURS: ShortcutsCommands = {
  winOs: 'Alt+Cmd+F',
  macOs: 'Command+Shift+F',
  linuxOs: 'Alt+Cmd+F'
}

const START_LUNCH: ShortcutsCommands = {
  winOs: 'Alt+Cmd+L',
  macOs: 'Command+Shift+L',
  linuxOs: 'Alt+Cmd+L'
}

const FINISH_LUNCH: ShortcutsCommands = {
  winOs: 'Alt+Cmd+J',
  macOs: 'Command+Shift+J',
  linuxOs: 'Alt+Cmd+J'
}

const CLOSE_APP: ShortcutsCommands = {
  winOs: 'Alt+Cmd+X',
  macOs: 'Command+Shift+X',
  linuxOs: 'Alt+Cmd+X'
}

export {
  START_WORKING_HOURS,
  FINISH_WORKING_HOURS,
  START_LUNCH,
  FINISH_LUNCH,
  CLOSE_APP
}