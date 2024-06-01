import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from '@inertiajs/react';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { format } from 'date-fns';

const FloatLabelDemo = () => {
    const initialState = {
        reference: '',
        nom_article: '',
        description: '',
        date_commande: null,
        budget_disponible: null,
    };

    const { data, setData, post, processing, errors, reset } = useForm(initialState);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Formater la date
        const formattedDate = data.date_commande ? format(data.date_commande, 'yyyy-MM-dd') : null;

        try {
            await axios.post('/ajoutCommande', {
                reference: data.reference,
                nom_article: data.nom_article,
                description: data.description,
                date_commande: formattedDate,
                budget_disponible: data.budget_disponible,
            });
            alert('Commande effectuée avec succès');
            reset();
        } catch (err) {
            console.error('Erreur lors de l\'ajout de la commande', err);
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="content-section implementation">
                <div className="card">
                    <div className="p-fluid grid">

                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <AutoComplete value={data.reference} field="name" onChange={(e) => setData('reference', e.value)} />
                                <label htmlFor="autocomplete"><b>Référence</b></label>
                            </span>
                        </div>

                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <AutoComplete value={data.nom_article} field="name" onChange={(e) => setData('nom_article', e.value)} />
                                <label htmlFor="autocomplete"><b>Article</b></label>
                            </span>
                        </div>

                        <div className="field col-12">
                            <span className="p-float-label">
                                <InputTextarea id="textarea" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} />
                                <label htmlFor="textarea"><b>Description</b></label>
                            </span>
                        </div>

                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <Calendar id="calendar" value={data.date_commande} onChange={(e) => setData('date_commande', e.value)} />
                                <label htmlFor="calendar"><b>Date de commande</b></label>
                            </span>
                        </div>

                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <InputNumber inputId="inputnumber" value={data.budget_disponible} onChange={(e) => setData('budget_disponible', e.value)} />
                                <label htmlFor="inputnumber"><b>Budget</b></label>
                            </span>
                        </div>

                    </div>
                </div>
            </div>

            <div className="button-group">
                <button type="submit" className="p-button p-component p-button-success" disabled={processing}>
                    Submit
                </button>
                <button type="button" className="p-button p-component p-button-secondary" onClick={handleReset} disabled={processing}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default FloatLabelDemo;
