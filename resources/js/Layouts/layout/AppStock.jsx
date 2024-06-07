import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

const CrudTable = () => {
    const emptyArticle = {
        id: null,
        nom_article: '',
        quantite: '',
        site: '',
        date_peremption: ''
    };

    const [listeStock, setListeStock] = useState([]);
    const [listeStockPerime, setListeStockPerime] = useState([]);
    const [articleDialog, setArticleDialog] = useState(false);
    const [deleteArticleDialog, setDeleteArticleDialog] = useState(false);
    const [deleteArticlesDialog, setDeleteArticlesDialog] = useState(false);
    const [article, setArticle] = useState(emptyArticle);
    const [selectedArticles, setSelectedArticles] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        axios.get('/stockAffichage')
            .then(response => {
                setListeStock(response.data.listeStock);
                console.log(response.data.listeStock);
                setListeStockPerime(response.data.listeStockPerime);
            })
            .catch(error => {
                console.error("There was an error fetching the articles!", error);
            });
    }, []);

    const openNew = () => {
        setArticle(emptyArticle);
        setSubmitted(false);
        setArticleDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setArticleDialog(false);
    }

    const hideDeleteArticleDialog = () => {
        setDeleteArticleDialog(false);
    }

    const hideDeleteArticlesDialog = () => {
        setDeleteArticlesDialog(false);
    }

    const saveArticle = () => {
        setSubmitted(true);

        if (article.nom_article.trim()) {
            let _articles = [...listeStock];
            let _article = {...article};
            if (article.id) {
                // Mettre à jour l'article existant
                axios.put(`/articles/${article.id}`, article)
                    .then(response => {
                        const index = _articles.findIndex(a => a.id === article.id);
                        _articles[index] = response.data;
                        setListeStock(_articles);
                        setArticleDialog(false);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Article Updated', life: 3000 });
                    })
                    .catch(error => {
                        console.error("There was an error updating the article!", error);
                    });
            } else {
                // Créer un nouvel article
                axios.post('/articles', article)
                    .then(response => {
                        _articles.push(response.data);
                        setListeStock(_articles);
                        setArticleDialog(false);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Article Created', life: 3000 });
                    })
                    .catch(error => {
                        console.error("There was an error creating the article!", error);
                    });
            }
        }
    }

    const editArticle = (article) => {
        setArticle({...article});
        setArticleDialog(true);
    }

    const confirmDeleteArticle = (article) => {
        setArticle(article);
        setDeleteArticleDialog(true);
    }

    const deleteArticle = () => {
        axios.delete(`/articles/${article.id}`)
            .then(response => {
                setListeStock(listeStock.filter(a => a.id !== article.id));
                setDeleteArticleDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Article Deleted', life: 3000 });
            })
            .catch(error => {
                console.error("There was an error deleting the article!", error);
            });
    }

    const deleteSelectedArticles = () => {
        axios.delete('/articles', { data: { ids: selectedArticles.map(a => a.id) } })
            .then(response => {
                setListeStock(listeStock.filter(a => !selectedArticles.map(sa => sa.id).includes(a.id)));
                setDeleteArticlesDialog(false);
                setSelectedArticles([]);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Articles Deleted', life: 3000 });
            })
            .catch(error => {
                console.error("There was an error deleting the articles!", error);
            });
    }

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Articles</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const articleDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveArticle} />
        </React.Fragment>
    );

    const deleteArticleDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteArticleDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteArticle} />
        </React.Fragment>
    );

    const deleteArticlesDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteArticlesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedArticles} />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editArticle(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteArticle(rowData)} />
            </React.Fragment>
        );
    }

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />
            <div className="card">
                <h2>Liste Stock</h2>
                <DataTable ref={dt} value={listeStock} selection={selectedArticles} onSelectionChange={(e) => setSelectedArticles(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="nom_article" header="Nom de l'article" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="quantite" header="Quantité" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="nom_site" header="Site" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="date_peremption" header="Date de péremption" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column body={actionBodyTemplate} key="action"></Column>
                </DataTable>

                <h2>Liste Stock Périmé</h2>
                <DataTable ref={dt} value={listeStockPerime} selection={selectedArticles} onSelectionChange={(e) => setSelectedArticles(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="nom_article" header="Nom de l'article" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="quantite" header="Quantité" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="nom_site" header="Site" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="date_peremption" header="Date de péremption" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column body={actionBodyTemplate} key="action"></Column>
                </DataTable>
            </div>

            <Dialog visible={articleDialog} style={{ width: '450px' }} header="Article Details" modal className="p-fluid" footer={articleDialogFooter} onHide={hideDialog}>
                {/* Input fields for article details */}
            </Dialog>

            <Dialog visible={deleteArticleDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteArticleDialogFooter} onHide={hideDeleteArticleDialog}>
                {/* Confirmation dialog content */}
            </Dialog>

            <Dialog visible={deleteArticlesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteArticlesDialogFooter} onHide={hideDeleteArticlesDialog}>
                {/* Confirmation dialog content */}
            </Dialog>
        </div>
    );
}

export default CrudTable;
