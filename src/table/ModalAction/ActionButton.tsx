import React, { useState } from 'react'

interface ActionButtonProps {
    onClick(): void
    disabled?: boolean
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled = false, children }) => {
    const [hover, setHover] = useState<boolean>(false)

    const toggleHover = () => setHover(curHover => !curHover)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault()
        onClick()
    }

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            style={{
                backgroundColor: hover ? '#ddd' : 'transparent',
                borderRadius: '2px',
                boxShadow: 'none',
                borderColor: 'transparent',
                cursor: 'pointer',
                padding: '5px 5px',
                textAlign: 'center',
                fontSize: '1rem',
            }}
            onMouseEnter={toggleHover}
            onMouseLeave={toggleHover}
        >
            {children}
        </button>
    )
}

export default ActionButton
