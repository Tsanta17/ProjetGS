import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';

const FloatLabelDemo = () => {
    const initialState = {
        article: '',
        description: '',
        orderDate: null,
        budget: null,
        selectedCities: []
    };

    const { data, setData, post, processing, errors, reset } = useForm(initialState);

    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [cities] = useState([
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ]);

    useEffect(() => {
        // Fetch countries or any other initial data if needed
        // Example: setCountries(fetchedCountries);
    }, []);

    const searchCountry = (event) => {
        setTimeout(() => {
            const results = countries.filter((country) => {
                return country.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
            setFilteredCountries(results);
        }, 250);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register'); // Adjust the URL according to your route
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
                                <AutoComplete value={data.article} suggestions={filteredCountries} completeMethod={searchCountry} field="name" onChange={(e) => setData('article', e.value)} />
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
                                <Calendar id="calendar" value={data.orderDate} onChange={(e) => setData('orderDate', e.value)} />
                                <label htmlFor="calendar"><b>Date de commande</b></label>
                            </span>
                        </div>

                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <InputNumber inputId="inputnumber" value={data.budget} onChange={(e) => setData('budget', e.value)} />
                                <label htmlFor="inputnumber"><b>Budget</b></label>
                            </span>
                        </div>

                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <MultiSelect inputId="multiselect" value={data.selectedCities} options={cities} onChange={(e) => setData('selectedCities', e.value)} optionLabel="name" />
                                <label htmlFor="multiselect"><b>MultiSelect</b></label>
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
