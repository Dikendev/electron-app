import { useMemo } from 'react'

import AppStatus from '../../../types/app-status.interface'
import { AvailableCommands } from '../../../types/automata'
import { ExistOrNot } from '../../../types/automata/sheet-data.interface'
import { SheetCellContentFilledValue, SheetViewData } from 'src/types/sheet-view-data.interface'

import Tooltip from './Tooltip'
import ShortCuts from './Shortcuts'

import { Button } from 'antd'

interface ActionsProps {
    appStatus: AppStatus
    sheetValues: SheetViewData
    onClickAction: (options: AvailableCommands) => void
}

const Actions = ({ appStatus, onClickAction, sheetValues }: ActionsProps): JSX.Element[] => {
    return Object.keys(sheetValues).map((sheet) => {
        const sheetCellContent = sheetValues[sheet] as SheetCellContentFilledValue

        return (
            <ActionStatus
                key={sheet}
                appStatus={appStatus}
                sheetValue={sheetCellContent.value}
                sheetCellContent={sheetCellContent}
                onClick={() => onClickAction(sheetCellContent.action)}
            />
        )
    })
}

interface ActionStatusProps {
    appStatus: AppStatus
    sheetValue: ExistOrNot
    sheetCellContent: SheetCellContentFilledValue
    onClick: () => void
}

const ActionStatus = ({
    appStatus,
    sheetValue,
    sheetCellContent,
    onClick
}: ActionStatusProps): JSX.Element => {
    // const buttonDescriptionClass = useMemo(() => {
    //     return sheetValue ? 'registered' : ''
    // }, [sheetValue])

    const buttonDisabled = useMemo(() => {
        return !appStatus.credential || !appStatus.internet
    }, [appStatus.credential, appStatus.internet])

    return (
        <div
            style={{ position: 'relative' }}
        >
            <Button type="primary" disabled={buttonDisabled} onClick={onClick}>
                {sheetCellContent.description}
            </Button>
            <SheetValues sheetValues={sheetValue} />
            <ShortCuts shortCut={sheetCellContent.shortcut} />
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
                top: -5,
                left: '50%',
                right: '50%',
                width: 'fit-content',
                textAlign: 'center',
                transform: 'translate(-50%, -50%)',
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
