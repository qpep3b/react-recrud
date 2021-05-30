import React from 'react'
import ReactModal from 'react-modal'

ReactModal.setAppElement('body')

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
                overlay: {
                    overflowX: 'hidden',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(100, 100, 100, 0.75)',
                },
                content: {
                    boxSizing: 'border-box',
                    color: 'rgba(0, 0, 0, .85)',
                    fontSize: '14px',
                    margin: '0 auto',
                    maxWidth: 'calc(100vw - 32px)',
                    padding: '20px 10px',
                    position: 'relative',
                    top: '100px',
                    width: 'auto',
                },
            }}
        >
            {children}
        </ReactModal>
    )
}

export default BaseModal
