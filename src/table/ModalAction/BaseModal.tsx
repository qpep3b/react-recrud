import React from 'react'
import ReactModal from 'react-modal'

ReactModal.setAppElement('body')

interface BaseModalProps {
    isOpen: boolean
    onRequestClose(): void
    title?: string
}

const BaseModal: React.FC<BaseModalProps> = ({
    isOpen,
    onRequestClose,
    title = null,
    children,
}) => {
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
                    position: 'relative',
                    padding: '0',
                    top: '100px',
                    width: '520px',
                    border: '1px solid rgba(80, 80, 80, 0.75)',
                },
            }}
            onAfterOpen={() => (document.body.style.overflow = 'hidden')}
            onAfterClose={() => (document.body.style.overflow = 'unset')}
        >
            <ModalHeader title={title} />
            <div className="react-recrud-modal-content">{children}</div>
        </ReactModal>
    )
}

interface ModalHeaderProps {
    title?: string | null
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title }) => {
    if (title === null) return null

    return <div className="react-recrud-modal-header">{title}</div>
}

export default BaseModal
