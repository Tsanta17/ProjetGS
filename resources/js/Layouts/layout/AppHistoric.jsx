import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Timeline } from 'primereact/timeline';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import '../../../css/FormDemo.css';  // Assurez-vous d'ajouter un fichier CSS pour les styles personnalisés

const AppHistoric = () => {

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

    const customizedMarker = (item) => {
        return (
            <span className="custom-marker shadow-1" style={{ backgroundColor: item.markerColor }}></span>
        );
    };

    const customizedContent = (item) => {
        return (
            <Card title={item.title}>
                <p>{item.description}</p>
                <Tag className="mt-2" severity={item.tagSeverity}>{item.tagText}</Tag>
            </Card>
        );
    };

    return (
        <div className="activity-history">
            <div className="card">
                <h5>Activity History</h5>
                <Timeline value={activities} align="alternate" className="customized-timeline"
                    marker={customizedMarker} content={customizedContent} />
            </div>
        </div>
    );
};

export default AppHistoric;
