import React, { useState, useEffect, useRef } from 'react';
import { PickList } from 'primereact/picklist';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { ToggleButton } from 'primereact/togglebutton';

import axios from 'axios';

export default function AppCheckOrder() {
    const [source, setSource] = useState([]);
    const [target, setTarget] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [supplierList, setSupplierList] = useState([]);
    const [form, setForm] = useState({ supplier: null, quantity: '', unitPrice: '' });
    const [showDialog, setShowDialog] = useState(false);
    const [commandeDetailArticle, setCommandeDetailArticle] = useState(null);
    const [commandeDetailSite, setCommandeDetailSite] = useState(null);
    const [commandeDetails, setCommandeDetails] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        axios.get('/servicesListes')
            .then(response => {
                setSource(response.data.enAttente);
                setTarget(response.data.validee);
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the commandes!', error);
            });
    }, []);

    const openDialog = async () => {
        if (selectedItems.length > 0) {
            const commandeId = selectedItems[0].commande_id; // Assuming the selected item has an 'id' field
            console.log(commandeId);
            try {
                const response = await axios.get(`/commande/details/${commandeId}`);
                setCommandeDetailArticle(response.data.commande.article);
                setCommandeDetailSite(response.data.commande.site);
                console.log(response);
                setCommandeDetails(response.data.commande);
                const ListFournisseur = response.data.fournisseur.map(f => ({ label: f.nom_fournisseur, value: f.fournisseur_id }));
                setSupplierList(ListFournisseur);
                setForm({ supplier: null, quantity: '', unitPrice: '' });
                setShowDialog(true);
            } catch (error) {
                console.error('There was an error fetching the commande details!', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Unable to fetch commande details', life: 3000 });
            }
        }
    };

    const validateCommande = async () => {
        if (selectedItems.length > 0) {
            const commandeId = selectedItems[0].commande_id; // Assuming the selected item has an 'id' field
            try {
                const response = await axios.patch(`/commande/valider/${commandeId}`, {
                    prix_unitaire: form.unitPrice,
                    quantite: form.quantity,
                    fournisseur: form.supplier
                });
                moveSelected();
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Commande validée', life: 3000 });
            } catch (error) {
                console.error('There was an error validating the commande!', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Unable to validate commande', life: 3000 });
            }
        }
    };

    const moveSelected = () => {
        setSource(prevSource => prevSource.filter(item => !selectedItems.includes(item)));
        setTarget(prevTarget => [...prevTarget, ...selectedItems]);
        setSelectedItems([]);
        setShowDialog(false);
    };

    const onChange = (event) => {
        setSource(event.source);
        setTarget(event.target);
    };

    const itemTemplate = (item, isSource) => {
        const nom_article = item.article.nom_article;

        const handleToggle = (e) => {
            const selected = e.value;
            if (selected) {
                setSelectedItems(prevSelected => [...prevSelected, item]);
            } else {
                setSelectedItems(prevSelected => prevSelected.filter(i => i.commande_id !== item.commande_id));
            }
        };

        const isSelected = selectedItems.some(i => i.commande_id === item.commande_id);

        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">{nom_article}</span>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-tag text-sm"></i>
                        <span>{item.date_commande}</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold text-900">${item.budget_disponible}</span>
                    <div className="flex align-items-center gap-2">
                        {isSource ? (
                            <ToggleButton checked={isSelected} onChange={handleToggle} onLabel="Sélectionné" offLabel="Select" />
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
            <Button label="Annuler" icon="pi pi-times" onClick={() => setShowDialog(false)} className="p-button-text" />
            <Button label="Approuvé" icon="pi pi-check" onClick={validateCommande} disabled={selectedItems.length === 0} />
        </React.Fragment>
    );

    return (
        <>
            <Toast ref={toast} />
            <div className="card">
                <PickList
                    dataKey="commande_id"
                    source={source}
                    target={target}
                    selectedItems={selectedItems}
                    onChange={onChange}
                    onSelectionChange={e => setSelectedItems(e.value)}
                    itemTemplate={(item) => itemTemplate(item, source.includes(item))}
                    filter filterBy="nom_article"
                    breakpoint="1280px"
                    sourceHeader="En attente"
                    targetHeader="Validée"
                    sourceStyle={{ height: '24rem' }}
                    targetStyle={{ height: '24rem' }}
                    sourceFilterPlaceholder="Search by name"
                    targetFilterPlaceholder="Search by name"
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
                {commandeDetails && (
                    <div className="p-fluid">
                        <div className="field">
                            <label>Nom du site</label>
                            <InputText value={commandeDetailSite.nom_site} readOnly />
                        </div>
                        <div className="field">
                            <label>Budget disponible</label>
                            <InputText value={commandeDetails.budget_disponible} readOnly />
                        </div>
                        <div className="field">
                            <label>Article</label>
                            <InputText value={commandeDetailArticle.nom_article} readOnly />
                        </div>
                        <div className="field">
                            <label>Référence de l'article</label>
                            <InputText value={commandeDetails.reference_article} readOnly />
                        </div>
                        <div className="field">
                            <label>Fournisseur</label>
                            <Dropdown value={form.supplier} options={supplierList} onChange={handleFormChange} optionLabel="label" optionValue="value" placeholder="Select a Supplier" name="supplier" />
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
