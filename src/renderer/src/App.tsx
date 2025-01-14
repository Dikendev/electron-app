import { useEffect, useReducer, useState } from 'react'
import keyboard from './assets/keyboard.svg'

import Actions from './components/Actions'
import Clock from './components/Clock'
import ShortCuts from './components/Shortcuts'
import Versions from './components/Versions'
import Loading, { LoadingStatus } from './components/Loading'
import Status from './components/Status'
import WorkingTimes from './components/WorkingTimes'
import Logo from './components/Logo'

import { CredentialsInfo } from '../../types/credentials-info.interface'
import { UserPreferences } from '../../types/user-preferences'
import { IStore } from '../../types/store.interface'
import { AvailableCommands, SheetCellContentFilled } from '../../types/automata'
import AppStatus from '../../types/app-status.interface'
import { UpdateAll } from '../../types/automata/sheet-data.interface'

type AppStatusAction = "APP_UP" | "APP_DOWN" | "INTERNET_UP" | "INTERNET_DOWN"

interface ReducerState extends AppStatus, CredentialsInfo { }

const reducer = (state: AppStatus, action: { type: AppStatusAction }): AppStatus => {
    switch (action.type) {
        case "APP_UP": {
            return {
                credential: true,
                internet: true
            }
        }
        case "APP_DOWN": {
            return {
                credential: false,
                internet: false
            }
        }
        case "INTERNET_UP": {
            return {
                ...state,
                internet: true
            }
        }
        case "INTERNET_DOWN": {
            return {
                ...state,
                internet: false
            }
        }
        default: return state
    }
}

const App = (): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false)
    const [workingTimes, setWorkingTimes] = useState<string>("")
    const [requestStatus, setRequestStatus] = useState<LoadingStatus>('idle')
    const [credentials, setCredentials] = useState<CredentialsInfo>({
        id: "",
        clientEmail: "",
        privateKey: ""
    })

    const [valuesFromSheet, setValuesFromSheet] = useState<SheetCellContentFilled>({
        startWorkingHours: null,
        startLunch: null,
        finishLunch: null,
        finishWorkingHours: null
    })

    const [appStatus, dispatch] = useReducer(reducer, {
        credential: false,
        internet: false
    });


    const updateId = async (id: string) => {
        console.log('chamou???')
        
        setCredentials((prev) => ({
            ...prev,
            id
        }))

        try {
            await getWorkingTimes()
        } catch (error) {
            console.error(error)
        }
    }

    const updateClientEmail = (clientEmail: string) => {
        setCredentials((prev) => ({
            ...prev,
            clientEmail
        }))
    }

    const updatePrivateKey = (privateKey: string) => {
        setCredentials((prev) => ({
            ...prev,
            privateKey
        }))
    }

    function openClose() {
        setIsOpen((prev) => !prev)
    }

    const getWorkingTimes = async () => {
        try {
            const workingTimes = await window.api.executeGetWorkTimes()

            if ('workingTimeTotal' in workingTimes) {
                setWorkingTimes(workingTimes.workingTimeTotal)
                setRequestStatus('success')
                dispatch({ type: 'APP_UP' })
            }

        } catch (error) {
            setRequestStatus('error')
            dispatch({ type: 'APP_DOWN' })
        }
    }

    const onClickAction = async (option: AvailableCommands) => {
        if (!appStatus.credential || !appStatus.internet) return

        setRequestStatus('loading')
        try {
            await window.api.executeWorkAutomate(option)
            await getWorkingTimes()
            await updateValuesFromSheet()
            setRequestStatus('success')
        } catch (error) {
            setRequestStatus('error')
            dispatch({ type: 'APP_DOWN' })
        }
    }

    const updateValuesFromSheet = async () => {
        try {
            const valuesFromSheet = await window.api.getTodaySheetTimes()
            setValuesFromSheet((prev) => ({ ...prev, ...valuesFromSheet }))
        } catch (error) {
            console.log('AQUI')
        }
    }

    const updateAll: UpdateAll = {
        updateId,
        updateClientEmail,
        updatePrivateKey,
        checkOnUpdate: getWorkingTimes
    }

    useEffect(() => {
        // const internetPing = async (): Promise<void> => {
        //     try {
        //         window.api.internetPing()
        //     } catch (error) {
        //         console.log('ERROR CATCH ?')
        //         dispatch({ type: "INTERNET_DOWN" })
        //     }
        // }

        window.api.internetPing().then((result) => {
            dispatch({ type: "INTERNET_UP" })

        }).catch((error) => {
            dispatch({ type: "INTERNET_DOWN" })
        })
    }, [])

    useEffect(() => {
        const read = async (): Promise<UserPreferences | IStore> => {
            return await window.api.loadPreferences<UserPreferences>()
        }

        try {
            read().then((result) => {
                if ('credentials' in result) {
                    setCredentials((prev) => ({
                        ...prev,
                        ...result.credentials
                    }))

                    getWorkingTimes().then((result) => {
                        dispatch({ type: 'APP_UP' })

                    }).catch((error) => {
                        setRequestStatus('error')
                        dispatch({ type: 'APP_DOWN' })
                    })
                }
            }).catch((error) => {
                console.error(error)
                setRequestStatus('error')
                dispatch({ type: 'APP_DOWN' })
            })
        } catch (error) {
            console.log('CATCH', error)
        }
    }, [])

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            console.log(`You pressed ${event.key}`)
        }

        window.addEventListener('keyup', handleKeyPress)

        return () => {
            window.removeEventListener('keyup', handleKeyPress)
        }
    }, [])

    useEffect(() => {
        if (requestStatus === 'success') {
            setTimeout(() => {
                setRequestStatus('idle')
            }, 2000);
        }
    }, [requestStatus])

    useEffect(() => {
        updateValuesFromSheet()
        getWorkingTimes()
    }, [])

    return (<>
        <div className="shortCuts_button">
            <img style={{ color: 'white' }} alt="logo" className="shortcut_button" src={keyboard} onClick={openClose} />
        </div>

        <ShortCuts isOpen={isOpen} />

        <Logo credential={appStatus.credential} />

        <Status
            appStatus={appStatus}
            credentials={credentials}
            updateAll={updateAll}
        />

        <div className="creator">automatizando processos</div>
        <div className="creator">Powered by Consistem</div>
        <div className="text">
            Electron app with <span className="react">React</span>
            &nbsp;and <span className="ts">TypeScript</span>
        </div>

        <Clock />

        {/* <p className="tip"> */}
        {/* Please try pressing <code>F12</code> to open the devTool */}
        {/* Aqui pode ter uma explicação do app */}
        {/* </p> */}

        <Actions
            appStatus={appStatus}
            onClickAction={onClickAction}
            sheetValues={valuesFromSheet}
        />

        <div style={{ paddingTop: '3rem' }}>
            <Loading status={requestStatus} />
        </div>

        <WorkingTimes workingTimesTotal={workingTimes} />
        <Versions idSheet={credentials.id} />
    </>)
}

export default App