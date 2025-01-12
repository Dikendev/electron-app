import AppStatus from "../../../types/app-status.interface"
import { AvailableCommands, SheetCellContentFilled } from "../../../types/automata"
import { ExistOrNot } from "../../../types/automata/sheet-data.interface"

interface ActionsProps {
    appStatus: AppStatus
    sheetValues: SheetCellContentFilled
    onClickAction: (options: AvailableCommands) => void
}

const Actions = ({
    appStatus,
    onClickAction,
    sheetValues
}: ActionsProps): JSX.Element => {
    return (
        <div className="actions">
            <ActionStatus
                appStatus={appStatus.credential}
                sheetValue={sheetValues.startWorkingHours}
                description="Início do expediente"
                onClick={() => onClickAction('INICIO_EXP')}
            />

            <ActionStatus
                appStatus={appStatus.credential}
                sheetValue={sheetValues.startLunch}
                description="Início do almoço"
                onClick={() => onClickAction('INICIO_ALM')}
            />

            <ActionStatus
                appStatus={appStatus.credential}
                sheetValue={sheetValues.finishLunch}
                description="Fim do almoço"
                onClick={() => onClickAction('FIM_ALM')}
            />

            <ActionStatus
                appStatus={appStatus.credential}
                sheetValue={sheetValues.finishWorkingHours}
                description="Fim do expediente"
                onClick={() => onClickAction('FIM_EXP')}
            />
        </div>
    )
}

interface ActionStatusProps {
    appStatus: boolean
    sheetValue: ExistOrNot
    description: string
    onClick: (action: AvailableCommands) => void
}

const ActionStatus = ({
    appStatus,
    sheetValue,
    description,
    onClick
}: ActionStatusProps): JSX.Element => {
    return (
        <div
            style={{ position: 'relative' }}
            className={appStatus ? 'action' : 'action disabled'}
            onClick={() => onClick}>
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
                textAlign: "center",
                borderRadius: "0.3rem"
            }}>
            {sheetValues ? <p className="tip">{sheetValues}</p> : '-'}
        </code>
    )
}

export default Actions