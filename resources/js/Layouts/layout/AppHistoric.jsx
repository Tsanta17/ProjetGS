import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import '../../../css/DataTable.css';

const AppHistorique = () => {
    const [historique, setHistorique] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);

    useEffect(() => {
        axios.get('/historique')
            .then(response => {
                setHistorique(response.data);
                console.log(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the history data!", error);
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
                <h5 className="m-0">Historique des Actions</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Rechercher..." />
                </span>
            </div>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <Button label="Détails" className="p-button-rounded p-button-info" onClick={() => openDialog(rowData)} />
        );
    };

    const openDialog = (action) => {
        setSelectedAction(action);
        setDialogVisible(true);
    }

    const userBodyTemplate = (rowData) => {
        return rowData.user.name;
    }

    const articleBodyTemplate = (rowData) => {
        return rowData.article.nom_article;
    }

    const header = renderHeader();

    return (
        <div className="datatable-doc-demo">
            <div className="card">
                <DataTable value={historique} paginator className="p-datatable-customers" header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" rowsPerPageOptions={[10, 25, 50]}
                    dataKey="id" rowHover globalFilterFields={['date', 'user.name', 'action', 'description']} loading={loading} responsiveLayout="scroll"
                    emptyMessage="Aucune action trouvée." currentPageReportTemplate="Affichage {first} à {last} de {totalRecords} entrées"
                    filters={{ global: { value: globalFilterValue, matchMode: 'contains' } }}>

                    <Column field="created_at" header="Date" sortable style={{ minWidth: '8rem' }} />
                    <Column field="user.name" header="Utilisateur" body={userBodyTemplate} sortable style={{ minWidth: '12rem' }} />
                    <Column field="action" header="Action" sortable style={{ minWidth: '10rem' }} />
                    <Column field="description" header="Description" sortable style={{ minWidth: '20rem' }} />
                    <Column field="article.nom_article" header="Article" body={articleBodyTemplate} sortable style={{ minWidth: '12rem' }} />
                    <Column body={actionBodyTemplate} headerStyle={{ width: '8rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                </DataTable>

                <Dialog header="Détails de l'Action" visible={dialogVisible} style={{ width: '50vw' }} onHide={() => setDialogVisible(false)}>
                    {selectedAction && (
                        <div>
                            <div><strong>Date: </strong>{selectedAction.created_at}</div>
                            <div><strong>Utilisateur: </strong>{selectedAction.user.name}</div>
                            <div><strong>Action: </strong>{selectedAction.action}</div>
                            <div><strong>Description: </strong>{selectedAction.description}</div>
                            <div><strong>Article: </strong>{selectedAction.article.nom_article}</div>
                        </div>
                    )}
                </Dialog>
            </div>
        </div>
    );
}

export default AppHistorique;
