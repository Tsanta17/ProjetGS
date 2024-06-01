import React, { useState, useEffect } from 'react';
import { PickList } from 'primereact/picklist';
import axios from 'axios';

export default function AppCheckOrder() {
    const [source, setSource] = useState([]);
    const [target, setTarget] = useState([]);

    useEffect(() => {
        axios.get('/servicesListes')  // Assurez-vous que l'URL est correcte
            .then(response => {
                setSource(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the commandes!', error);
            });
    }, []);

    const onChange = (event) => {
        setSource(event.source);
        setTarget(event.target);
    };

    const itemTemplate = (item) => {
        console.log(item);
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                {/* Remplacez avec les champs pertinents de votre commande */}
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">{item.reference_article}</span>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-tag text-sm"></i>
                        <span>{item.date_commande}</span>
                    </div>
                </div>
                <span className="font-bold text-900">${item.budget_disponible}</span>
            </div>
        );
    };

    return (
        <div className="card">
            <PickList dataKey="id" source={source} target={target} onChange={onChange} itemTemplate={itemTemplate} breakpoint="1280px"
                sourceHeader="En attente" targetHeader="Validée" sourceStyle={{ height: '24rem' }} targetStyle={{ height: '24rem' }} />
        </div>
    );
}
