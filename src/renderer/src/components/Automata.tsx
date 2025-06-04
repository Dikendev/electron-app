import { useCallback, useEffect, useReducer, useState } from "react"

import Loading, { LoadingStatus } from "./Loading"
import { CredentialsInfo } from "../../../types/credentials-info.interface"
import { SheetViewData } from "../../../types/sheet-view-data.interface"
import { AvailableCommands } from "../../../types/automata"
import { UpdateAll } from "../../../types/automata/sheet-data.interface"
import { UserPreferences } from "../../../types/user-preferences"
import { IStore } from "../../../types/store.interface"
import AppStatus from "../../../types/app-status.interface"

import Logo from "./Logo"
import Status from "./Status"
import Clock from "./Clock"
import Actions from "./Actions"
import WorkingTimes from "./WorkingTimes"
import FinalDepartureTime from "./FinalDepartureTime"
import DepartureTime from "./DepartureTime"
import Versions from "./Versions"
import { FINISH_LUNCH, FINISH_WORKING_HOURS, START_LUNCH, START_WORKING_HOURS } from "../../../shared/shortcuts-commands.constant"

type AppStatusAction =
    'APP_UP' | 'APP_DOWN' | 'INTERNET_UP' | 'INTERNET_DOWN' | 'TODAY_NOT_FOUND' | 'TODAY_FOUND'

const reducer = (state: AppStatus, action: { type: AppStatusAction }): AppStatus => {
    switch (action.type) {
        case 'APP_UP': {
            return {
                credential: true,
                internet: true,
                today: true
            }
        }
        case 'APP_DOWN': {
            return {
                credential: false,
                internet: false,
                today: false,
            }
        }
        case 'INTERNET_UP': {
            return {
                ...state,
                internet: true
            }
        }
        case 'INTERNET_DOWN': {
            return {
                ...state,
                internet: false
            }
        }
        case 'TODAY_NOT_FOUND': {
            return {
                ...state,
                today: false
            }
        }
        case 'TODAY_FOUND': {
            return {
                ...state,
                today: true
            }
        }
        default:
            return state
    }
}

const initialValuesFromSheet: SheetViewData = {
    startWorkingHours: {
        action: 'INICIO_EXP',
        description: 'Início do expediente',
        value: null,
        shortcut: START_WORKING_HOURS
    },
    startLunch: {
        action: 'INICIO_ALM',
        description: 'Início do almoço',
        value: null,
        shortcut: START_LUNCH
    },
    finishLunch: {
        action: 'FIM_ALM',
        description: 'Fim do almoço',
        value: null,
        shortcut: FINISH_LUNCH
    },
    finishWorkingHours: {
        action: 'FIM_EXP',
        description: 'Fim do expediente',
        value: null,
        shortcut: FINISH_WORKING_HOURS
    }
}

const Automata = (): JSX.Element => {
    const platform = window.api.os.platform

    const [workingTimes, setWorkingTimes] = useState<string>('')
    const [requestStatus, setRequestStatus] = useState<LoadingStatus>('idle')
    const [credentials, setCredentials] = useState<CredentialsInfo>({
        id: '',
        clientEmail: '',
        privateKey: ''
    })

    const [expectedWorkingTimeTotal, setExpectedWorkingTimeTotal] = useState<string>('')

    const [valuesFromSheet, setValuesFromSheet] = useState<SheetViewData>({
        ...initialValuesFromSheet
    })

    // const saveToLocalStorage = (time: string) => {
    //     window.api.savePreference('workingTime', { value: time })
    // }

    const resetValuesFromSheet = (): void => {
        setValuesFromSheet({ ...initialValuesFromSheet })
    }

    const [appStatus, dispatch] = useReducer(reducer, {
        credential: false,
        internet: false,
        today: false
    })

    const updateId = async (id: string): Promise<void> => {
        setCredentials((prev) => ({
            ...prev,
            id
        }))

        await getWorkingTimes()
    }

    const updateClientEmail = (clientEmail: string): void => {
        setCredentials((prev) => ({
            ...prev,
            clientEmail
        }))
    }

    const updatePrivateKey = (privateKey: string): void => {
        setCredentials((prev) => ({
            ...prev,
            privateKey
        }))
    }

    const onClickAction = useCallback(async (option: AvailableCommands): Promise<void> => {
        if (!appStatus.credential || !appStatus.internet || !appStatus.today) return

        setRequestStatus('loading')

        try {
            await window.api.executeWorkAutomate(option)
            await getWorkingTimes()
            await updateValuesFromSheet()
            setRequestStatus('success')
        } catch (error) {
            setErrorSystemError()
        }
    }, [appStatus])

    const getWorkingTimes = async (): Promise<void> => {
        try {
            const workingTimes = await window.api.executeGetWorkTimes()
            await updateValuesFromSheet()

            if ('workingTimeTotal' in workingTimes) {
                setWorkingTimes(workingTimes.workingTimeTotal)
                setRequestStatus('success')
                dispatch({ type: 'APP_UP' })
            }
        } catch (error) {
            dispatch({ type: 'TODAY_NOT_FOUND' })
            setErrorSystemError()
        }
    }

    const updateValuesFromSheet = async (): Promise<void> => {
        try {
            const valuesFromSheet = await window.api.getTodaySheetTimes()

            if ('startWorkingHours' in valuesFromSheet) {
                setValuesFromSheet((prev) => ({
                    ...prev,
                    startWorkingHours: {
                        ...prev.startWorkingHours,
                        value: valuesFromSheet.startWorkingHours
                    },
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

    const setErrorSystemError = (): void => {
        resetValuesFromSheet()
        setRequestStatus('error')
        dispatch({ type: 'APP_DOWN' })
    }

    const onChangeFinalDepartureTime = (_date: any, dateString: string | string[]) => {
        if (!Array.isArray(dateString)) {
            window.api.savePreference('workingTime', {
                value: dateString
            })
            setExpectedWorkingTimeTotal(dateString)
        }
    }

    const updateAll: UpdateAll = {
        updateId,
        updateClientEmail,
        updatePrivateKey,
        checkOnUpdate: getWorkingTimes
    }

    useEffect(() => {
        window.api
            .internetPing()
            .then(() => {
                dispatch({ type: 'INTERNET_UP' })
            })
            .catch(() => {
                dispatch({ type: 'INTERNET_DOWN' })
            })
    }, [])

    useEffect(() => {
        const read = async (): Promise<UserPreferences | IStore> => {
            return await window.api.loadPreferences<UserPreferences>()
        }

        read()
            .then((result) => {
                if ('credentials' in result) {
                    setCredentials((prev) => ({
                        ...prev,
                        ...result.credentials
                    }))

                    console.log('result', result)

                    setExpectedWorkingTimeTotal(result.workingTime.value)
                    getWorkingTimes()
                }
            })
            .catch(() => {
                setErrorSystemError()
            })
    }, [])

    useEffect(() => {
        const handleKeyPress = async (event: KeyboardEvent): Promise<void> => {
            console.log(`You pressed ${event.key}`)

            switch (platform) {
                case 'darwin': {
                    if (event.ctrlKey && event.key === 'e') await onClickAction('INICIO_EXP')
                    if (event.ctrlKey && event.key === 'a') await onClickAction('INICIO_ALM')
                    if (event.ctrlKey && event.key === 'b') await onClickAction('FIM_ALM')
                    if (event.ctrlKey && event.key === 'f') await onClickAction('FIM_EXP')
                }
            }
        }

        window.addEventListener('keyup', handleKeyPress)

        return (): void => {
            window.removeEventListener('keyup', handleKeyPress)
        }
    }, [onClickAction])

    useEffect(() => {
        if (requestStatus === 'success') {
            setTimeout(() => {
                setRequestStatus('idle')
            }, 2000)
        }
    }, [requestStatus])

    useEffect(() => {
        updateValuesFromSheet()
        getWorkingTimes()
    }, [])

    // useEffect(() => {
    //     if (expectedWorkingTimeTotal && expectedWorkingTimeTotal.length) saveToLocalStorage(expectedWorkingTimeTotal)
    // }, [expectedWorkingTimeTotal])

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white'
            }}
        >
            <Logo credential={appStatus} />

            <Status
                appStatus={appStatus}
                credentials={credentials}
                updateAll={updateAll}
            />

            {/* <Youtube /> */}

            {/* <div className="creator">Automatizando processos</div> */}
            {/* <div className="creator">Created by Diego Kennedy</div> */}
            {/* <div className="text">
                Electron app with <span className="react">React</span>
                &nbsp;and <span className="ts">TypeScript</span>
            </div> */}

            <Clock />

            {/* <p className="tip"> */}
            {/* Please try pressing <code>F12</code> to open the devTool */}
            {/* Aqui pode ter uma explicação do app */}
            {/* </p> */}

            <div className='actions'>
                <Actions
                    appStatus={appStatus}
                    onClickAction={onClickAction}
                    sheetValues={valuesFromSheet}
                />
            </div>

            <div style={{ paddingTop: '3rem' }}>
                <Loading status={requestStatus} />
            </div>

            <WorkingTimes workingTimesTotal={workingTimes} />

            <FinalDepartureTime
                expectedWorkingTimeTotal={expectedWorkingTimeTotal}
                onChange={onChangeFinalDepartureTime}
            />

            <DepartureTime
                startWorkingHours={valuesFromSheet.startWorkingHours.value}
                startLunch={valuesFromSheet.startLunch.value}
                finishLunch={valuesFromSheet.finishLunch.value}
                expectedWorkingTimes={expectedWorkingTimeTotal}
            />

            <Versions idSheet={credentials.id} />

            {/* <button onClick={() => window.api.job('20:58')}>JOB TEST</button> */}
        </div>
    )
}

export default Automata
