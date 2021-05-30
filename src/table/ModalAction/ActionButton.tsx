import React, { useState } from 'react'
import style from './ActionButton.scss'

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
        <button
            onClick={handleClick}
            disabled={disabled}
            className="react-recrud-table-action-button"
        >
            {children}
        </button>
    )
}

export default ActionButton
