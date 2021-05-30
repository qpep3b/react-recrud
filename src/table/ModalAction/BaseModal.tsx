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
                maxWidth: '500px',
                width: '100%',
                border: '1px solid #000000',
                position: 'fixed',
                left: '50%',
                top: '50%',
                padding: '15px',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#fff',
            }}
        >
            {children}
        </ReactModal>
    )
}

export default BaseModal
