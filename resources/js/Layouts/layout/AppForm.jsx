import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';

const AppForm = () => {
    const initialState = {
        reference: '',
        name: '',
        description: '',
        expirationDate: null,
        fournisseurId: null,
        siteId: null
    };

    const [formData, setFormData] = useState(initialState);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleNumberChange = (e, id) => {
        setFormData({ ...formData, [id]: e.value });
    };

    const handleSubmit = () => {
        console.log('Form data submitted:', formData);
        // Here you can add your form submission logic, e.g., send data to backend
    };

    const handleReset = () => {
        setFormData(initialState);
    };

    return (
        <div>
            <div className="card">
                <h5>Ajouter des Articles</h5>
                <div className="grid p-fluid">
                    <div className="col-12 md:col-4">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-hashtag"></i>
                            </span>
                            <InputText id="reference" value={formData.reference} onChange={handleInputChange} placeholder="Référence" />
                        </div>
                    </div>

                    <div className="col-12 md:col-4">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText id="name" value={formData.name} onChange={handleInputChange} placeholder="Nom" />
                        </div>
                    </div>

                    <div className="col-12 md:col-4">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-bars"></i>
                            </span>
                            <InputTextarea id="description" value={formData.description} onChange={handleInputChange} placeholder="Description" rows={2} />
                        </div>
                    </div>

                    <div className="col-12 md:col-4">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-calendar-times"></i>
                            </span>
                            <Calendar id="expirationDate" value={formData.expirationDate} onChange={(e) => handleNumberChange(e, 'expirationDate')} placeholder="Date de Péremption" />
                        </div>
                    </div>

                    <div className="col-12 md:col-4">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-id-card"></i>
                            </span>
                            <InputNumber id="fournisseurId" value={formData.fournisseurId} onValueChange={(e) => handleNumberChange(e, 'fournisseurId')} min={0} max={100} placeholder="Fournisseur ID" />
                            <Button icon="pi pi-minus" onClick={() => setFormData({ ...formData, fournisseurId: Math.max(formData.fournisseurId - 1, 0) })} />
                            <Button icon="pi pi-plus" onClick={() => setFormData({ ...formData, fournisseurId: Math.min(formData.fournisseurId + 1, 100) })} />
                        </div>
                    </div>

                    <div className="col-12 md:col-4">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-bookmark"></i>
                            </span>
                            <InputNumber id="siteId" value={formData.siteId} onValueChange={(e) => handleNumberChange(e, 'siteId')} min={0} max={100} placeholder="Site ID" />
                            <Button icon="pi pi-minus" onClick={() => setFormData({ ...formData, siteId: Math.max(formData.siteId - 1, 0) })} />
                            <Button icon="pi pi-plus" onClick={() => setFormData({ ...formData, siteId: Math.min(formData.siteId + 1, 100) })} />
                        </div>
                    </div>

                    <div className="col-12">
                        <Button label="Submit" icon="pi pi-check" onClick={handleSubmit} />
                        <Button label="Cancel" icon="pi pi-times" className="p-button-secondary ml-2" onClick={handleReset} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppForm;
