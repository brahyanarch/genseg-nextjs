'use client'
import ExportExcel from '@/components/componentesReportes/exportExcel';
import React from 'react';

const Reportes: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-start  h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
            <h1 className="text-2xl text-gray-800">Reportes</h1>
            <div className="w-4/5 p-5 bg-white shadow-md rounded-lg mt-5">
                <p className="text-base text-gray-600">Aquí puedes ver tus reportes.</p>
                <ExportExcel/>
            </div>
        </div>
    );
};

export default Reportes;
