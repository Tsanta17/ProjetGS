import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import '../../../css/DataTable.css';

const AppListAffectation = () => {
    const [affectations, setAffectations] = useState([]);
    const [selectedAffectations, setSelectedAffectations] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [currentAffectation, setCurrentAffectation] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        axios.get('/affectation/liste')
            .then(response => {
                setAffectations(response.data.affectationsEnAttente);
                console.log(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the affectation data!", error);
                setLoading(false);
            });
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">Affectations</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    }

    const siteTemplate = (rowData) => {
        return (
            <>
                <div>{rowData.site.nom_site}</div>
                <div>{rowData.site.adresse_site}</div>
            </>
        );
    };

    const userTemplate = (rowData) => {
        return (
            <>
                <div>{rowData.departement}</div>
            </>
        );
    };

    const statusTemplate = (rowData) => {
        return (
            <span className={`customer-badge status-${rowData.status}`}>
                {rowData.status}
            </span>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button label="Valider" className="p-button-rounded p-button-success" onClick={() => openDialog(rowData)} />
        );
    };

    const openDialog = (affectation) => {
        setCurrentAffectation(affectation);
        setDialogVisible(true);
    }

    const validateAffectation = () => {
        axios.get(`/affectation/valider/${currentAffectation.affectation_id}`)
            .then(response => {
                toast.current.show({ severity: 'success', summary: 'Succès', detail: 'Affectation validée avec succès', life: 3000 });
                // Mettre à jour le statut de l'affectation dans l'état
                setAffectations(prevAffectations => 
                    prevAffectations.map(affectation => 
                        affectation.affectation_id === currentAffectation.affectation_id 
                            ? { ...affectation, status: 'validee' } 
                            : affectation
                    )
                );
                setDialogVisible(false);
            })
            .catch(error => {
                console.error("Il y a eu une erreur lors de la validation de l'affectation!", error);
                toast.current.show({ severity: 'error', summary: 'Erreur', detail: 'La validation de l\'affectation a échoué', life: 3000 });
            });
    }

    const header = renderHeader();

    return (
        <div className="datatable-doc-demo">
            <Toast ref={toast} />
            <div className="card">
                <DataTable value={affectations} paginator className="p-datatable-customers" header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" rowsPerPageOptions={[10, 25, 50]}
                    dataKey="affectation_id" rowHover selection={selectedAffectations} onSelectionChange={e => setSelectedAffectations(e.value)}
                    globalFilterFields={['affectation_id', 'quantite', 'article.nom_article', 'site.nom_site', 'departement', 'statut']} loading={loading} responsiveLayout="scroll"
                    emptyMessage="No affectations found." currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    filters={{ global: { value: globalFilterValue, matchMode: 'contains' } }}>

                    <Column field="affectation_id" header="Affectation ID" sortable style={{ minWidth: '6rem' }} />
                    <Column field="quantite" header="Quantité" sortable style={{ minWidth: '8rem' }} />
                    <Column field="article.nom_article" header="Nom de l'Article" sortable style={{ minWidth: '14rem' }} />
                    <Column field="site.nom_site" header="Site" body={siteTemplate} sortable style={{ minWidth: '14rem' }} />
                    <Column field="departement" header="Département" body={userTemplate} sortable style={{ minWidth: '14rem' }} />
                    <Column field="statut" header="Statut" body={statusTemplate} sortable style={{ minWidth: '10rem' }} />
                    <Column body={actionBodyTemplate} headerStyle={{ width: '8rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                </DataTable>

                <Dialog header="Détails de l'Affectation" visible={dialogVisible} style={{ width: '50vw' }} onHide={() => setDialogVisible(false)}>
                    {currentAffectation && (
                        <div>
                            <div><strong>ID Affectation: </strong>{currentAffectation.affectation_id}</div>
                            <div><strong>Nom de l'Article: </strong>{currentAffectation.article.nom_article}</div>
                            <div><strong>Nom du Site: </strong>{currentAffectation.site.nom_site}</div>
                            <div><strong>Département: </strong>{currentAffectation.departement}</div>
                            <div><strong>Quantité: </strong>{currentAffectation.quantite}</div>
                            <Button label="Valider" icon="pi pi-check" onClick={validateAffectation} className="mt-4" />
                        </div>
                    )}
                </Dialog>
            </div>
        </div>
    );
}

export default AppListAffectation;
