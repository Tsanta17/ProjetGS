import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import '../../../css/DataTable.css';

const AppAffectation = () => {
    const [stocks, setStocks] = useState([]);
    const [selectedStocks, setSelectedStocks] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [currentStock, setCurrentStock] = useState(null);
    const [newQuantity, setNewQuantity] = useState(0);
    const toast = React.useRef(null);

    useEffect(() => {
        axios.get('/stock')
            .then(response => {
                setStocks(response.data.stocks);
                console.log(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the stock data!", error);
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
                <h5 className="m-0">Stocks</h5>
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

    const actionBodyTemplate = (rowData) => {
        return (
            <Button label="Affecter l'article" className="p-button-rounded p-button-success" onClick={() => openDialog(rowData)} />
        );
    };

    const openDialog = (stock) => {
        setCurrentStock(stock);
        setNewQuantity(stock.quantite);
        setDialogVisible(true);
    }

    const sendChanges = () => {
        // Vérifie si la quantité saisie est supérieure à la quantité disponible
        if (newQuantity > currentStock.quantite) {
            toast.current.show({ severity: 'warn', summary: 'Attention', detail: 'La quantité demandée excède la quantité disponible', life: 3000 });
            return;
        }

        axios.post('/affectation/create', {
            stock_id: currentStock.stock_id,
            quantite: newQuantity
        })
        .then(response => {
            toast.current.show({ severity: 'success', summary: 'Succès', detail: 'Affectation créée avec succès', life: 3000 });
            setDialogVisible(false);
        })
        .catch(error => {
            console.error("Il y a eu une erreur lors de la création de l'affectation!", error);
            toast.current.show({ severity: 'error', summary: 'Erreur', detail: error.response.data.erreur, life: 3000 });
        });
    }

    const header = renderHeader();

    return (
        <div className="datatable-doc-demo">
            <Toast ref={toast} />
            <div className="card">
                <DataTable value={stocks} paginator className="p-datatable-customers" header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" rowsPerPageOptions={[10, 25, 50]}
                    dataKey="id" rowHover selection={selectedStocks} onSelectionChange={e => setSelectedStocks(e.value)}
                    globalFilterFields={['stock_id', 'article.nom_article', 'quantite', 'site.nom_site', 'site.adresse_site']} loading={loading} responsiveLayout="scroll"
                    emptyMessage="No stocks found." currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    filters={{ global: { value: globalFilterValue, matchMode: 'contains' } }}>

                    <Column field="stock_id" header="ID" sortable style={{ minWidth: '6rem' }} />
                    <Column field="article.nom_article" header="Article" sortable style={{ minWidth: '14rem' }} />
                    <Column field="quantite" header="Quantité" sortable style={{ minWidth: '8rem' }} />
                    <Column field="site.nom_site" header="Site" body={siteTemplate} sortable style={{ minWidth: '14rem' }} />
                    <Column field="site.adresse_site" header="Adresse du Site" sortable style={{ minWidth: '14rem' }} />
                    <Column body={actionBodyTemplate} headerStyle={{ width: '8rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                </DataTable>

                <Dialog header="Détails du Stock" visible={dialogVisible} style={{ width: '50vw' }} onHide={() => setDialogVisible(false)}>
                    {currentStock && (
                        <div>
                            <div><strong>ID Stock: </strong>{currentStock.id}</div>
                            <div><strong>Nom de l'Article: </strong>{currentStock.article.nom_article}</div>
                            <div><strong>Nom du Site: </strong>{currentStock.site.nom_site}</div>
                            <div><strong>Quantité Disponible: </strong>{currentStock.quantite}</div>
                            <div className="field mt-4">
                                <label htmlFor="newQuantity">Nouvelle Quantité:</label>
                                <InputNumber id="newQuantity" value={newQuantity} onValueChange={(e) => setNewQuantity(e.value)} min={1} />
                            </div>
                            <Button label="Envoyer" icon="pi pi-check" onClick={sendChanges} className="mt-4" />
                        </div>
                    )}
                </Dialog>
            </div>
        </div>
    );
}

export default AppAffectation;
