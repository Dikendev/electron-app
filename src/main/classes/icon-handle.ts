import { join } from "path";

class IconHandle {
  static icon(process: NodeJS.Process) {
    if (process.platform !== 'win32') {
      return join(__dirname, '../../resources/icon.png');
    }
    return join(__dirname, '../../resources/windows.ico');
  }
}

export default IconHandle