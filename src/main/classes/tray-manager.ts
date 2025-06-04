import { CLOSE_APP, FINISH_LUNCH, START_LUNCH, START_WORKING_HOURS } from "../../shared/shortcuts-commands.constant"

class TrayManager {
    static trayIconsInfo(app: Electron.App): [Electron.MenuItem] {
        const iconsInfo = [
            {
                label: "Inicio expediente",
                accelerator: process.platform === "darwin"
                    ? START_WORKING_HOURS.mac
                    : START_WORKING_HOURS.win,
                click: () => { console.log("Inicio expediente!") }
            },
            {
                label: "Inicio almoço",
                accelerator: process.platform === "darwin"
                    ? START_LUNCH.mac
                    : START_LUNCH.win,
                click: () => { console.log("Inicio almoço!") }
            },
            {
                label: "Fim almoço",
                accelerator: process.platform === "darwin"
                    ? FINISH_LUNCH.mac
                    : FINISH_LUNCH.win,
                click: () => { console.log("Fim almoço!") }
            },
            {
                label: "Fim expediente",
                accelerator: process.platform === "darwin"
                    ? FINISH_LUNCH.mac
                    : FINISH_LUNCH.win,
                click: () => { console.log("Fim expediente") }
            },
            {
                label: "Sair do gerenciador",
                accelerator: process.platform === "darwin"
                    ? CLOSE_APP.mac
                    : CLOSE_APP.win,
                click: () => app.quit()
            }
        ]
        return iconsInfo as unknown as [Electron.MenuItem]
    }
}

export default TrayManager
