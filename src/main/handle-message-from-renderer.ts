import { ipcMain, IpcMainInvokeEvent, ipcRenderer } from 'electron'
import { ChannelMessage } from '../types/channel-message.interface'

const handleMessageFromRenderer = <T>(
    channel: string,
    listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<void> | any
): void => {
    ipcMain.handle(channel, async (event, args) => {
        const response: ChannelMessage<T> = {}

        try {
            response.message = await listener(event, args)
        } catch (error) {
            response.error = error
        }

        return response
    })
}

const sendMessageToMain = async (channel: string, ...args: any[]): Promise<any> => {
    const { message, error } = await ipcRenderer.invoke(channel, ...args)
    if (error) throw error
    return message
}

export { handleMessageFromRenderer, sendMessageToMain }
