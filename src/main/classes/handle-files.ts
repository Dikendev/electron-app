class HandleFiles {
	private dialog: Electron.Dialog

	constructor(dialog: Electron.Dialog) {
		this.dialog = dialog
	}

	openFile = async (): Promise<string | null> => {
		const { canceled, filePaths } = await this.dialog.showOpenDialog({})

		if (!canceled) {
			return filePaths[0]
		}

		return null
	}
}

export { HandleFiles }