import React from 'react';
import AppHistoric from './AppHistoric';

const activities = [
    {
        title: 'User Login',
        description: 'User John Doe logged in.',
        markerColor: '#ff9800',
        tagSeverity: 'info',
        tagText: 'Login',
        date: '2024-05-25'
    },
    {
        title: 'File Upload',
        description: 'User John Doe uploaded a file.',
        markerColor: '#4caf50',
        tagSeverity: 'success',
        tagText: 'Upload',
        date: '2024-05-26'
    },
    {
        title: 'Password Change',
        description: 'User John Doe changed their password.',
        markerColor: '#f44336',
        tagSeverity: 'warning',
        tagText: 'Security',
        date: '2024-05-27'
    }
];

const App = () => {
    return (
        <div className="app">
            <AppHistoric activities={activities} />
        </div>
    );
};

export default App;
