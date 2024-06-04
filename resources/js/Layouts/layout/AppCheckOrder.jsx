import React, { useState, useEffect, useRef } from 'react';
import { PickList } from 'primereact/picklist';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import axios from 'axios';

export default function AppCheckOrder() {
    const [source, setSource] = useState([]);
    const [target, setTarget] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        axios.get('/servicesListes')  // Assurez-vous que l'URL est correcte
            .then(response => {
                setSource(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the commandes!', error);
            });
    }, []);

    const accept = () => {
        if (selectedItem) {
            // Déplacer l'élément de la liste source à la liste cible
            setSource(prevSource => prevSource.filter(item => item.id !== selectedItem.id));
            setTarget(prevTarget => [...prevTarget, selectedItem]);
            toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Item moved', life: 3000 });
            setSelectedItem(null); // Réinitialiser l'élément sélectionné
        }
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'Operation canceled', life: 3000 });
    };

    const confirm1 = (item) => {
        setSelectedItem(item); // Stocker l'élément sélectionné
        confirmDialog({
            group: 'headless',
            message: 'Are you sure you want to move this item?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept,
            reject
        });
    };

    const onChange = (event) => {
        setSource(event.source);
        setTarget(event.target);
    };

    const itemTemplate = (item) => {
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
                        <Button onClick={() => confirm1(item)} icon="pi pi-eye" label="Vérification"></Button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="card">
                <PickList
                    dataKey="id"
                    source={source}
                    target={target}
                    onChange={onChange}
                    itemTemplate={itemTemplate}
                    breakpoint="1280px"
                    sourceHeader="En attente"
                    targetHeader="Validée"
                    sourceStyle={{ height: '24rem' }}
                    targetStyle={{ height: '24rem' }}
                />
            </div>

            <ConfirmDialog
                group="headless"
                content={({ headerRef, contentRef, footerRef, hide, message }) => (
                    <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
                        <div className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                            <i className="pi pi-question text-5xl"></i>
                        </div>
                        <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                            {message.header}
                        </span>
                        <p className="mb-0" ref={contentRef}>
                            {message.message}
                        </p>
                        <div className="flex align-items-center gap-2 mt-4" ref={footerRef}>
                            <Button
                                label="Save"
                                onClick={(event) => {
                                    hide(event);
                                    accept();
                                }}
                                className="w-8rem"
                            ></Button>
                            <Button
                                label="Cancel"
                                outlined
                                onClick={(event) => {
                                    hide(event);
                                    reject();
                                }}
                                className="w-8rem"
                            ></Button>
                        </div>
                    </div>
                )}
            />
        </>
    );
}
