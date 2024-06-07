import React, { useState } from 'react';
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
        budget_disponible: '',
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
            // Afficher les erreurs
            if (err.response && err.response.data && err.response.data.errors) {
                Object.keys(err.response.data.errors).forEach(key => {
                    console.error(`Erreur sur le champ ${key}: ${err.response.data.errors[key]}`);
                });
            }
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

                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <AutoComplete value={data.reference} field="name" onChange={(e) => setData('reference', e.value)} />
                                <label htmlFor="autocomplete"><b>Référence</b></label>
                            </span>
                            {errors.reference && <span className="error">{errors.reference}</span>}
                        </div>

                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <AutoComplete value={data.nom_article} field="name" onChange={(e) => setData('nom_article', e.value)} />
                                <label htmlFor="autocomplete"><b>Article</b></label>
                            </span>
                            {errors.nom_article && <span className="error">{errors.nom_article}</span>}
                        </div>

                        <div className="field col-12">
                            <span className="p-float-label">
                                <InputTextarea id="textarea" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} />
                                <label htmlFor="textarea"><b>Description</b></label>
                            </span>
                            {errors.description && <span className="error">{errors.description}</span>}
                        </div>

                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <Calendar id="calendar" value={data.date_commande} onChange={(e) => setData('date_commande', e.value)} />
                                <label htmlFor="calendar"><b>Date de commande</b></label>
                            </span>
                            {errors.date_commande && <span className="error">{errors.date_commande}</span>}
                        </div>

                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <AutoComplete inputId="inputnumber" value={data.budget_disponible} onChange={(e) => setData('budget_disponible', e.value)} />
                                <label htmlFor="inputnumber"><b>Budget</b></label>
                            </span>
                            {errors.budget_disponible && <span className="error">{errors.budget_disponible}</span>}
                        </div>

                    </div>
                </div>
            </div>

            <div className=" col-12 flex flex-col justify-center">
                <button type="submit" className="p-button p-component p-button-primary flex items-center justify-center font-bold mb-2" disabled={processing}>
                    Enregistrer
                </button>
                <button type="button" className="p-button p-component p-button-secondary flex items-center justify-center font-bold font-bold" onClick={handleReset} disabled={processing}>
                    Annuler
                </button>
            </div>
        </form>
    );
};

export default FloatLabelDemo;
