'use client'
import React from 'react';

const NotFound: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Error 404</h1>
            <p>No se pudo obtener las preguntas.</p>
            <p>404 Not Found</p>
        </div>
    );
};

export default NotFound;