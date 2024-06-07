import React, { useState, useEffect, useRef } from 'react';
import { PickList } from 'primereact/picklist';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { ToggleButton } from 'primereact/togglebutton';
import axios from 'axios';

export default function AppManageDelivery({ userRole }) {
    // State variables
    const [source, setSource] = useState([]); // Articles en attente de livraison
    const [target, setTarget] = useState([]); // Articles livrés
    const [sourceSelection, setSourceSelection] = useState([]); // Sélection d'articles dans la source
    const [targetSelection, setTargetSelection] = useState([]); // Sélection d'articles dans le target
    const [form, setForm] = useState({ expiryDate: null }); // Formulaire avec date de péremption
    const [showDialog, setShowDialog] = useState(false); // Affichage du dialogue
    const toast = useRef(null); // Référence pour le composant Toast

    const isService = userRole === 'Service';

    // Effect hook pour récupérer les données lors du montage du composant
    useEffect(() => {
        axios.get('/livraison')
            .then(response => {
                setSource(response.data.listeLivraisonAttente);
                setTarget(response.data.listeLivraisonValider);
                console.log(response.data); //ne s'affiche pas correctement
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Unable to fetch deliveries', life: 3000 });
            });
    }, []);

    // Fonction pour ouvrir le dialogue
    const openDialog = () => {
        if (sourceSelection.length > 0) {
            setShowDialog(true);
        }
    };

    // Fonction pour formater la date pour MySQL
    const formatDateForMySQL = (date) => {
        const d = new Date(date);
        const month = '' + (d.getMonth() + 1);
        const day = '' + d.getDate();
        const year = d.getFullYear();
        return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
    };

    // Fonction pour valider la livraison
    const validateDelivery = async () => {
        if (sourceSelection.length > 0 && form.expiryDate) {
            const livraisonId = sourceSelection[0].livraison_id;
            try {
                const formattedDate = formatDateForMySQL(form.expiryDate);
                await axios.post(`/livraison/update/${livraisonId}`, {
                    date_peremption: formattedDate
                });
                moveSelected();
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Livraison validée', life: 3000 });
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Impossible de valider', life: 3000 });
            }
        }
    };

    // Fonction pour déplacer les articles sélectionnés
    const moveSelected = () => {
        setSource(prevSource => prevSource.filter(item => !sourceSelection.includes(item)));
        setTarget(prevTarget => [...prevTarget, ...sourceSelection.map(item => ({ ...item, date_livraison: form.expiryDate.toLocaleDateString('fr-FR') }))]);
        setSourceSelection([]);
        setShowDialog(false);
    };

    // Fonction pour gérer le changement dans le PickList
    const onChange = (event) => {
        // Vérifie si des articles livrés sont tentés d'être déplacés vers la source
        const invalidMove = event.source.some(item => target.some(targetItem => targetItem.livraison_id === item.livraison_id));

        if (invalidMove) {
            toast.current.show({ severity: 'warn', summary: 'Invalid Move', detail: 'Impossible de revenir sur la liste', life: 3000 });
            return;C
        }

        // Si le déplacement est valide, met à jour les sources et cibles
        setSource(event.source);
        setTarget(event.target);
    };

    // Modèle d'élément pour le PickList
    const itemTemplate = (item, isSource) => {
        console.log(item);
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">{item.nom_article}</span>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-tag text-sm"></i>
                        <span>{item.nom_site}</span>
                    </div>
                </div>
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold text-900">{item.nom_fournisseur}</span>
                    <div className="flex align-items-center gap-2">
                        <span>{item.quantite}</span>
                        {isSource ? (
                            isService ? (
                                <span className="text-900" style={{ fontSize: '1.2rem', color: 'green' }} disabled>Non livré</span>
                            ) : (
                            <ToggleButton
                                checked={sourceSelection.some(i => i.livraison_id === item.livraison_id)}
                                onChange={(e) => {
                                    const selected = e.value;
                                    if (selected) {
                                        setSourceSelection(prevSelected => [...prevSelected, item]);
                                    } else {
                                        setSourceSelection(prevSelected => prevSelected.filter(i => i.livraison_id !== item.livraison_id));
                                    }
                                }}
                                onLabel="Sélectionné" offLabel="Select"
                            />
                        ) ) : (
                            <span>{new Date(item.date_livraison).toLocaleDateString('fr-FR')} <i className="pi pi-check" style={{ fontSize: '1.5rem', color: 'green' }}></i></span>
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
            <Button label="Cancel" icon="pi pi-times" onClick={() => setShowDialog(false)} className="p-button-text" />
            <Button label="Validate" icon="pi pi-check" onClick={validateDelivery} disabled={sourceSelection.length === 0 || !form.expiryDate} />
        </React.Fragment>
    );

    return (
        <>
            <Toast ref={toast} />
            <div className="card">
                <PickList
                    dataKey="livraison_id"
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
                    sourceHeader="Articles en attente de livraison"
                    targetHeader="Articles Livrés"
                    sourceStyle={{ height: '24rem' }}
                    targetStyle={{ height: '24rem' }}
                    sourceFilterPlaceholder="Recherche par nom"
                    targetFilterPlaceholder="Recherche par nom"
                />
                {userRole !== 'Service' && <Button
                    label="Approuver"
                    icon="pi pi-arrow-right"
                    onClick={openDialog}
                    disabled={sourceSelection.length === 0 || targetSelection.length > 0} // Désactiver si un article dans target est sélectionné
                    className="p-button-success"
                    style={{ marginTop: '1rem' }}
                />}
            </div>

            <Dialog visible={showDialog} style={{ width: '450px' }} header="Validation des Détails" modal footer={dialogFooter} onHide={() => setShowDialog(false)}>
                <div className="p-fluid">
                    <div className="field">
                        <label>Date de péremption</label>
                        <Calendar value={form.expiryDate} onChange={(e) => handleFormChange({ target: { name: 'expiryDate', value: e.value } })} showIcon />
                    </div>
                </div>
            </Dialog>
        </>
    );
}
