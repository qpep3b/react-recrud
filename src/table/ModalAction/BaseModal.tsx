import React from 'react'
import ReactModal from 'react-modal'

// ReactModal.setAppElement('#recrud-content-wrapper')

interface BaseModalProps {
    isOpen: boolean
    onRequestClose(): void
}

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onRequestClose, children }) => {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={{
                boxSizing: 'border-box',
                color: 'rgba(0, 0, 0, .85)',
                fontSize: '14px',
                margin: '0 auto',
                maxWidth: 'calc(100vw - 32px)',
                padding: '0 0 24px',
                position: 'relative',
                top: '100px',
                width: 'auto',
            }}
        >
            {children}
        </ReactModal>
    )
}

export default BaseModal
