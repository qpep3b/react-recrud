import React from 'react'

interface ActionButtonProps {
    onClick(): void
    disabled?: boolean
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled = false, children }) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault()
        onClick()
    }

    return (
        <button onClick={handleClick} disabled={disabled}>
            {children}
        </button>
    )
}

export default ActionButton
