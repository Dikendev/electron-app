import { useEffect, useMemo, useReducer, useState } from 'react'
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
import { AvailableCommands } from '../../types/automata'
import AppStatus from '../../types/app-status.interface'
import { UpdateAll } from '../../types/automata/sheet-data.interface'
import { SheetViewData } from 'src/types/sheet-view-data.interface'
import { DepartureTimeResponse } from 'src/types/automata/departure-time.interface'
import DepartureTime from './components/DepartureTime'

type AppStatusAction = "APP_UP" | "APP_DOWN" | "INTERNET_UP" | "INTERNET_DOWN"

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

const initialValuesFromSheet: SheetViewData = {
    startWorkingHours: {
        action: 'INICIO_EXP',
        description: 'Início do expediente',
        value: null
    },
    startLunch: {
        action: 'INICIO_ALM',
        description: 'Início do almoço',
        value: null
    },
    finishLunch:  {
        action: 'FIM_ALM',
        description: 'Fim do almoço',
        value: null
    },
    finishWorkingHours:  {
        action: 'FIM_EXP',
        description: 'Fim do expediente',
        value: null
    },
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

    const [valuesFromSheet, setValuesFromSheet] = useState<SheetViewData>({
        ...initialValuesFromSheet
    })

    const resetValuesFromSheet = () => {
        setValuesFromSheet({ ...initialValuesFromSheet })
    }

    const [appStatus, dispatch] = useReducer(reducer, {
        credential: false,
        internet: false
    });


    const updateId = async (id: string) => {
        setCredentials((prev) => ({
            ...prev,
            id
        }))

        await getWorkingTimes()
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

    const onClickAction = async (option: AvailableCommands) => {
        if (!appStatus.credential || !appStatus.internet) return

        setRequestStatus('loading')
        try {
            await window.api.executeWorkAutomate(option)
            await getWorkingTimes()
            await updateValuesFromSheet()
            setRequestStatus('success')
        } catch (error) {
            setErrorSystemError()
        }
    }

    const getWorkingTimes = async () => {
        try {
            const workingTimes = await window.api.executeGetWorkTimes()
            await updateValuesFromSheet()
            console.log('workingTimes', workingTimes)

            if ('workingTimeTotal' in workingTimes) {
                setWorkingTimes(workingTimes.workingTimeTotal)
                setRequestStatus('success')
                dispatch({ type: 'APP_UP' })
            }
        } catch (error) {
            setErrorSystemError()
        }
    }

    const updateValuesFromSheet = async () => {
        try {
            const valuesFromSheet = await window.api.getTodaySheetTimes()

            if ('startWorkingHours' in valuesFromSheet) {
                setValuesFromSheet((prev) => ({
                    ...prev,
                    startWorkingHours: {
                        ...prev.startWorkingHours,
                        value: valuesFromSheet.startWorkingHours
                    } ,
                    startLunch: {
                        ...prev.startLunch,
                        value: valuesFromSheet.startLunch
                    },
                    finishLunch: {
                        ...prev.finishLunch,
                        value: valuesFromSheet.finishLunch
                    },
                    finishWorkingHours: {
                        ...prev.finishWorkingHours,
                        value: valuesFromSheet.finishWorkingHours
                    }
                }))
            }
        } catch (error) {
            setErrorSystemError()
        }
    }

    const setErrorSystemError = () => {
        resetValuesFromSheet()
        setRequestStatus('error')
        dispatch({ type: 'APP_DOWN' })
    }

    const updateAll: UpdateAll = {
        updateId,
        updateClientEmail,
        updatePrivateKey,
        checkOnUpdate: getWorkingTimes
    }

    const calculateExpectedFinalTime = useMemo((): DepartureTimeResponse => {
        const startWorkingHourTime = valuesFromSheet.startWorkingHours.value
        const startLunchTime = valuesFromSheet.startLunch.value
        const finishLunchTime = valuesFromSheet.finishWorkingHours.value
    

        if (startWorkingHourTime && startLunchTime && finishLunchTime) {
           return window.api.departureTime({ 
                startWorkingHourTime, 
                startLunchTime, 
                expectedWorkingTimes: "17:30", 
                finishLunchTime 
            })
        }

        return {
            totalLunch: "",
            expectedFinalWorkingTime: ""
        }
    }, [valuesFromSheet.startWorkingHours, valuesFromSheet.startLunch, valuesFromSheet.finishWorkingHours])


    useEffect(() => {
        window.api.internetPing().then(() => {
            dispatch({ type: "INTERNET_UP" })

        }).catch(() => {
            dispatch({ type: "INTERNET_DOWN" })
        })
    }, [])

    useEffect(() => {
        const read = async (): Promise<UserPreferences | IStore> => {
            return await window.api.loadPreferences<UserPreferences>()
        }

        read().then((result) => {
            if ('credentials' in result) {
                setCredentials((prev) => ({
                    ...prev,
                    ...result.credentials
                }))

                getWorkingTimes()
            }
        }).catch(() => {
            setErrorSystemError()
        })
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
            <img
                style={{ color: 'white' }}
                alt="logo"
                className="shortcut_button"
                src={keyboard}
                onClick={openClose}
            />
        </div>

        <ShortCuts isOpen={isOpen} />

        <Logo credential={appStatus.credential} />

        <Status
            appStatus={appStatus}
            credentials={credentials}
            updateAll={updateAll}
        />

        <div className="creator">Automatizando processos</div>
        <div className="creator">Created by Diego Kennedy</div>
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
        <DepartureTime totalHoursAtLunch={calculateExpectedFinalTime.totalLunch} dayTotalTime={'17:30'} expectedFinalWorkingHour={calculateExpectedFinalTime.expectedFinalWorkingTime} />
        <Versions idSheet={credentials.id} />
    </>)
}

export default App