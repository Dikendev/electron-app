import { CLOSE_APP, FINISH_LUNCH, START_LUNCH, START_WORKING_HOURS } from "../constants/shortcuts-commands.constant"

class TrayManager {
  static trayIconsInfo(app: Electron.App): [Electron.MenuItem] {
    const iconsInfo = [
      {
        label: "Inicio expediente",
        accelerator: process.platform === "darwin"
          ? START_WORKING_HOURS.macOs
          : START_WORKING_HOURS.winOs,
        click: () => { console.log("Inicio expediente!") }
      },
      {
        label: "Inicio almoço",
        accelerator: process.platform === "darwin"
          ? START_LUNCH.macOs
          : START_LUNCH.winOs,
        click: () => { console.log("Inicio almoço!") }
      },
      {
        label: "Fim almoço",
        accelerator: process.platform === "darwin"
          ? FINISH_LUNCH.macOs
          : FINISH_LUNCH.winOs,
        click: () => { console.log("Fim almoço!") }
      },
      {
        label: "Fim expediente",
        accelerator: process.platform === "darwin"
          ? FINISH_LUNCH.macOs
          : FINISH_LUNCH.winOs,
        click: () => { console.log("Fim expediente") }
      },
      {
        label: "Fechar do gerenciador",
        accelerator: process.platform === "darwin"
          ? CLOSE_APP.macOs
          : CLOSE_APP.winOs,
        click: () => app.quit()
      }
    ]
    return iconsInfo as unknown as [Electron.MenuItem]
  }
}

export default TrayManager