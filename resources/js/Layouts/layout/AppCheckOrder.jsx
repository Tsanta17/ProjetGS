import React, { useState, useEffect, useRef } from 'react';
import { PickList } from 'primereact/picklist';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import axios from 'axios';

export default function AppCheckOrder() {
    const [source, setSource] = useState([]);
    const [target, setTarget] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [supplierList, setSupplierList] = useState([]);
    const [form, setForm] = useState({ supplier: null, quantity: '', unitPrice: '' });
    const [showDialog, setShowDialog] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        axios.get('/servicesListes')
            .then(response => {
                setSource(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the commandes!', error);
            });

        axios.get('/suppliersList')
            .then(response => {
                setSupplierList(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the suppliers!', error);
            });
    }, []);

    const openDialog = () => {
        if (selectedItems.length > 0) {
            setForm({ supplier: null, quantity: '', unitPrice: '' });
            setShowDialog(true);
        }
    };

    const moveSelected = () => {
        setSource(prevSource => prevSource.filter(item => !selectedItems.includes(item)));
        setTarget(prevTarget => [...prevTarget, ...selectedItems]);
        setSelectedItems([]);
        setShowDialog(false);
        toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Items moved', life: 3000 });
    };

    const onChange = (event) => {
        setSource(event.source);
        setTarget(event.target);
    };

    const itemTemplate = (item, isSource) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">{item.reference_article}</span>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-tag text-sm"></i>
                        <span>{item.date_commande}</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold text-900">${item.budget_disponible}</span>
                    <div className="flex align-items-center gap-2">
                        {isSource ? (
                            <Button icon="pi pi-eye" label="Sélectionné" onClick={() => setSelectedItems([item])} />
                        ) : (
                            <i className="pi pi-check" style={{ fontSize: '1.5rem', color: 'green' }}></i>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const dialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setShowDialog(false)} className="p-button-text" />
            <Button label="Move Selected" icon="pi pi-check" onClick={moveSelected} disabled={selectedItems.length === 0} />
        </React.Fragment>
    );

    return (
        <>
            <Toast ref={toast} />
            <div className="card">
                <PickList
                    dataKey="id"
                    source={source}
                    target={target}
                    selectedItems={selectedItems}
                    onChange={onChange}
                    onSelectionChange={e => setSelectedItems(e.value)}
                    itemTemplate={(item) => itemTemplate(item, source.includes(item))}
                    breakpoint="1280px"
                    sourceHeader="En attente"
                    targetHeader="Validée"
                    sourceStyle={{ height: '24rem' }}
                    targetStyle={{ height: '24rem' }}
                />
                <Button
                    label="Move Selected"
                    icon="pi pi-arrow-right"
                    onClick={openDialog}
                    disabled={selectedItems.length === 0}
                    className="p-button-success"
                    style={{ marginTop: '1rem' }}
                />
            </div>

            <Dialog visible={showDialog} style={{ width: '450px' }} header="Vérification des Détails" modal footer={dialogFooter} onHide={() => setShowDialog(false)}>
                {selectedItems.length > 0 && (
                    <div className="p-fluid">
                        <div className="field">
                            <label>Nom du site</label>
                            <InputText value={selectedItems[0].site} readOnly />
                        </div>
                        <div className="field">
                            <label>Budget disponible</label>
                            <InputText value={selectedItems[0].budget_disponible} readOnly />
                        </div>
                        <div className="field">
                            <label>Article</label>
                            <InputText value={selectedItems[0].article} readOnly />
                        </div>
                        <div className="field">
                            <label>Référence de l'article</label>
                            <InputText value={selectedItems[0].reference_article} readOnly />
                        </div>
                        <div className="field">
                            <label>Fournisseur</label>
                            <Dropdown value={form.supplier} options={supplierList} onChange={handleFormChange} optionLabel="name" placeholder="Select a Supplier" name="supplier" />
                        </div>
                        <div className="field">
                            <label>Quantité</label>
                            <InputText value={form.quantity} onChange={handleFormChange} name="quantity" />
                        </div>
                        <div className="field">
                            <label>Prix Unitaire</label>
                            <InputNumber value={form.unitPrice} onValueChange={(e) => setForm(prevForm => ({ ...prevForm, unitPrice: e.value }))} mode="currency" currency="USD" locale="en-US" name="unitPrice" />
                        </div>
                    </div>
                )}
            </Dialog>
        </>
    );
}
