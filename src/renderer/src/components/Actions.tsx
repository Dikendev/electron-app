import { useCallback } from 'react'

import AppStatus from '../../../types/app-status.interface'
import { AvailableCommands } from '../../../types/automata'
import { ExistOrNot } from '../../../types/automata/sheet-data.interface'
import { SheetCellContentFilledValue, SheetViewData } from 'src/types/sheet-view-data.interface'

import Tooltip from './Tooltip'

interface ActionsProps {
    appStatus: AppStatus
    sheetValues: SheetViewData
    onClickAction: (options: AvailableCommands) => void
}

const Actions = ({ appStatus, onClickAction, sheetValues }: ActionsProps): JSX.Element[] => {
    return Object.keys(sheetValues).map((sheet) => {
        const resultValue = sheetValues[sheet] as SheetCellContentFilledValue

        return (
            <ActionStatus
                key={sheet}
                appStatus={appStatus}
                sheetValue={resultValue.value}
                description={resultValue.description}
                onClick={() => onClickAction(resultValue.action)}
            />
        )
    })
}

interface ActionStatusProps {
    appStatus: AppStatus;
    sheetValue: ExistOrNot;
    description: string;
    onClick: () => void;
}

const ActionStatus = ({
    appStatus,
    sheetValue,
    description,
    onClick
}: ActionStatusProps): JSX.Element => {
    const buttonDescriptionClass = useCallback(() => {
        return sheetValue ? 'registered' : ''
    }, [description])

    const appStatusStyle = useCallback(() => {
        return !appStatus.today ? 'action' : 'action disabled'
    }, [appStatus])

    return (
        <div
            style={{ position: 'relative' }}
            className={`${buttonDescriptionClass()} ${appStatusStyle()}`}
            onClick={() => onClick()}
        >
            <a>{description}</a>
            <SheetValues sheetValues={sheetValue} />
        </div>
    )
}

interface SheetValuesProp {
    sheetValues: ExistOrNot
}

const SheetValues = ({ sheetValues }: SheetValuesProp): JSX.Element => {
    return (
        <code
            style={{
                position: 'absolute',
                top: -15,
                left: 50,
                right: 50,
                width: '5rem',
                textAlign: 'center',
                borderRadius: '0.3rem'
            }}
        >
            {sheetValues ? (
                <Tooltip className="tip" description={sheetValues} tooltip="Horário registrado" />
            ) : (
                '-'
            )}
        </code>
    )
}

export default Actions
