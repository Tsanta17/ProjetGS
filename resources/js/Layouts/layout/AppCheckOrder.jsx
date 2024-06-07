import React, { useState, useEffect, useRef } from 'react';
import { PickList } from 'primereact/picklist';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { ToggleButton } from 'primereact/togglebutton';
import { useUser } from '@/Layouts/layout/context/usercontext';
import axios from 'axios';

export default function AppCheckOrder( {userRole} ) {

    // State variables
    const [source, setSource] = useState([]); // Commandes en attente
    const [target, setTarget] = useState([]); // Commandes validées
    const [sourceSelection, setSourceSelection] = useState([]); // Sélection d'articles dans la source
    const [targetSelection, setTargetSelection] = useState([]); // Sélection d'articles dans le target
    const [supplierList, setSupplierList] = useState([]); // Liste des fournisseurs
    const [form, setForm] = useState({ supplier: null, quantity: '', unitPrice: '' }); // Formulaire de validation
    const [showDialog, setShowDialog] = useState(false); // Affichage du dialogue
    const [commandeDetailArticle, setCommandeDetailArticle] = useState(null); // Détails de l'article de la commande
    const [commandeDetailSite, setCommandeDetailSite] = useState(null); // Détails du site de la commande
    const [commandeDetails, setCommandeDetails] = useState(null); // Détails de la commande
    const toast = useRef(null); // Référence pour le composant Toast

    // Effect hook pour récupérer les données lors du montage du composant
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

    // Fonction pour ouvrir le dialogue
    const openDialog = async () => {
        if (sourceSelection.length > 0) {
            const commandeId = sourceSelection[0].commande_id; // Assuming the selected item has an 'id' field
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

    // Fonction pour valider la commande
    const validateCommande = async () => {
        if (sourceSelection.length > 0) {
            const commandeId = sourceSelection[0].commande_id; // Assuming the selected item has an 'id' field
            try {
                await axios.patch(`/commande/valider/${commandeId}`, {
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

    // Fonction pour déplacer les articles sélectionnés
    const moveSelected = () => {
        setSource(prevSource => prevSource.filter(item => !sourceSelection.includes(item)));
        setTarget(prevTarget => [...prevTarget, ...sourceSelection]);
        setSourceSelection([]);
        setShowDialog(false);
    };

    // Fonction pour gérer le changement dans le PickList
    // const onChange = (event) => {
    //     // Vérifie si des commandes sont tentées d'être déplacées directement de la source vers le target sans validation
    //     const attemptedMoveToTarget = event.target.some(item => source.includes(item) && !sourceSelection.includes(item));
    //     const attemptedMoveToSource = event.source.some(item => target.includes(item));

    //     if (attemptedMoveToTarget || attemptedMoveToSource) {
    //         toast.current.show({ severity: 'warn', summary: 'Invalid Move', detail: 'You must use the "Move Selected" button to move items to the validated list', life: 3000 });
    //         // Annule le déplacement en restaurant les états précédents de source et target
    //         setSource(prevSource => [...prevSource]);
    //         setTarget(prevTarget => [...prevTarget]);
    //         return;
    //     }

    //     // Si le déplacement est valide, met à jour les sources et cibles
    //     setSource(event.source);
    //     setTarget(event.target);
    // };

    const onChange = (event) => {
        // Vérifie si des commandes sont tentées d'être déplacées directement de la source vers le target sans validation
        const attemptedMoveToTarget = event.target.some(item => source.includes(item) && !sourceSelection.includes(item));
        const attemptedMoveToSource = event.source.some(item => target.includes(item));
    
        // Vérifie si l'utilisateur est un "Service"
        const isService = userRole === 'Service';
    
        // Si l'utilisateur est un "Service" et qu'il tente de déplacer des articles du source vers le target
        if (isService && attemptedMoveToTarget) {
            // Afficher une alerte indiquant à l'utilisateur qu'il n'a pas l'autorisation
            toast.current.show({ severity: 'warn', summary: 'Invalid Move', detail: 'Vous n\'avez pas l\'autorisation de déplacer des articles vers la liste validée.', life: 3000 });
            // Annuler le déplacement en restaurant les états précédents de source et target
            setSource(prevSource => [...prevSource]);
            setTarget(prevTarget => [...prevTarget]);
            return;
        }
    
        if (attemptedMoveToTarget || attemptedMoveToSource) {
            toast.current.show({ severity: 'warn', summary: 'Invalid Move', detail: 'You must use the "Move Selected" button to move items to the validated list', life: 3000 });
            // Annule le déplacement en restaurant les états précédents de source et target
            setSource(prevSource => [...prevSource]);
            setTarget(prevTarget => [...prevTarget]);
            return;
        }
    
        // Si le déplacement est valide, met à jour les sources et cibles
        setSource(event.source);
        setTarget(event.target);
    };
    
    // Fonction pour gérer le déplacement par sélection
    // const moveSelected = () => {
    //     // Vérifie si l'utilisateur est un "Service"
    //     const isService = userRole === 'Service';
    
    //     // Si l'utilisateur est un "Service", affiche une alerte et retourne
    //     if (isService) {
    //         alert("Vous n'avez pas l'autorisation de déplacer des articles vers la liste validée.");
    //         return;
    //     }
    
    //     // Déplace les articles sélectionnés
    //     setSource(prevSource => prevSource.filter(item => !sourceSelection.includes(item)));
    //     setTarget(prevTarget => [...prevTarget, ...sourceSelection]);
    //     setSourceSelection([]);
    //     setShowDialog(false);
    // };

    // Modèle d'élément pour le PickList
    const itemTemplate = (item, isSource) => {
        const nom_article = item.article.nom_article;

        const handleToggle = (e) => {
            const selected = e.value;
            if (selected) {
                setSourceSelection(prevSelected => [...prevSelected, item]);
            } else {
                setSourceSelection(prevSelected => prevSelected.filter(i => i.commande_id !== item.commande_id));
            }
        };

        const isSelected = sourceSelection.some(i => i.commande_id === item.commande_id);
        const isService = userRole === 'Service';

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
                            userRole === 'Service' ? (
                                <span className="text-900" style={{ fontSize: '1.2rem', color: 'red' }} disabled>En attente</span>
                            ) : (
                                <ToggleButton checked={isSelected} onChange={handleToggle} onLabel="Sélectionné" offLabel="Select" />
                            )
                        ) : (
                            <i className="pi pi-check" style={{ fontSize: '1.5rem', color: 'green' }}></i>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Fonction pour gérer les changements de formulaire
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    // Pied de dialogue
    const dialogFooter = (
        <React.Fragment>
            <Button label="Annuler" icon="pi pi-times" onClick={() => setShowDialog(false)} className="p-button-text" />
            <Button label="Approuvé" icon="pi pi-check" onClick={validateCommande} disabled={sourceSelection.length === 0 || !form.supplier
        || !form.quantity || !form.unitPrice} />
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
                            sourceSelection={sourceSelection}
                            targetSelection={targetSelection}
                            onSourceSelectionChange={(e) => setSourceSelection(e.value)}
                            onTargetSelectionChange={(e) => setTargetSelection(e.value)}
                            onChange={onChange}
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
                        {userRole !== 'Service' && <Button
                            label="Move Selected"
                            icon="pi pi-arrow-right"
                            onClick={openDialog}
                            disabled={sourceSelection.length === 0 || targetSelection.length > 0} // Désactiver si un article dans target est sélectionné
                            className="p-button-success"
                            style={{ marginTop: '1rem' }}
                        />}
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
