import React from 'react';

const ModuleView = ({ 
    title = 'Module View',
    children,
    className = '',
    showHeader = true,
    onBack = null 
}) => {
    return (
        <div className={`module-view ${className}`}>
            {showHeader && (
                <div className="module-header">
                    {onBack && (
                        <button onClick={onBack} className="back-button">
                            ← Back
                        </button>
                    )}
                    <h1>{title}</h1>
                </div>
            )}
            <div className="module-content">
                {children || <p>No content provided</p>}
            </div>
        </div>
    );
};

export default ModuleView;