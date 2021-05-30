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
        <button
            onClick={handleClick}
            disabled={disabled}
            style={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                borderColor: 'transparent',
                cursor: 'pointer',
                padding: '5px 5px',
                textAlign: 'center',
            }}
        >
            {children}
        </button>
    )
}

export default ActionButton
