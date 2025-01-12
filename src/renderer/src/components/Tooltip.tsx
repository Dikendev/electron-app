interface TooltipProps {
    description: string,
    tooltip: string
    className?: string
}
const Tooltip = ({ description, tooltip, className }: TooltipProps) => {
    return (
        <p
            className={`${className} tooltip`}
        >
            {description}
            <span className="tooltip-text">{tooltip}</span>
        </p>
    )
}

export default Tooltip