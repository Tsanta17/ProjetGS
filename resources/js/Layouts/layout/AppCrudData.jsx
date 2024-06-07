import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

const AppCrudData = () => {
    const emptyArticle = {
        id: null,
        reference: '',
        nom_article: '',
        description: '',
        date_peremption: '',
        statut: ''
    };

    const [articles, setArticles] = useState([]);
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
        axios.get('/articles')
            .then(response => {
                setArticles(response.data);
            })
            .catch(error => {
                console.error("Erreur de mis en liste des articles!", error);
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
            let _articles = [...articles];
            let _article = {...article};
            if (article.id) {
                // Mettre à jour l'article existant
                axios.put(`/articles/${article.id}`, article)
                    .then(response => {
                        const index = _articles.findIndex(a => a.id === article.id);
                        _articles[index] = response.data;
                        setArticles(_articles);
                        setArticleDialog(false);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Article modifié', life: 3000 });
                    })
                    .catch(error => {
                        console.error("Erreur à l'ajout de l'article!!", error);
                    });
            } else {
                // Créer un nouvel article
                axios.post('/articles', article)
                    .then(response => {
                        _articles.push(response.data);
                        setArticles(_articles);
                        setArticleDialog(false);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Article crée', life: 3000 });
                    })
                    .catch(error => {
                        console.error("Erreur à l'ajout de l'article!", error);
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
                setArticles(articles.filter(a => a.id !== article.id));
                setDeleteArticleDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Article supprimé', life: 3000 });
            })
            .catch(error => {
                console.error("Erreur de suppression!", error);
            });
    }

    const deleteSelectedArticles = () => {
        axios.delete('/articles', { data: { ids: selectedArticles.map(a => a.id) } })
            .then(response => {
                setArticles(articles.filter(a => !selectedArticles.map(sa => sa.id).includes(a.id)));
                setDeleteArticlesDialog(false);
                setSelectedArticles([]);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Article supprimé', life: 3000 });
            })
            .catch(error => {
                console.error("Erreur de supression!", error);
            });
    }

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Articles</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Rechercher..." />
            </span>
        </div>
    );

    const articleDialogFooter = (
        <React.Fragment>
            <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Sauvegarder" icon="pi pi-check" className="p-button-text" onClick={saveArticle} />
        </React.Fragment>
    );

    const deleteArticleDialogFooter = (
        <React.Fragment>
            <Button label="Non" icon="pi pi-times" className="p-button-text" onClick={hideDeleteArticleDialog} />
            <Button label="Oui" icon="pi pi-check" className="p-button-text" onClick={deleteArticle} />
        </React.Fragment>
    );

    const deleteArticlesDialogFooter = (
        <React.Fragment>
            <Button label="Non" icon="pi pi-times" className="p-button-text" onClick={hideDeleteArticlesDialog} />
            <Button label="Oui" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedArticles} />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteArticle(rowData)} />
            </React.Fragment>
        );
    }

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />
            <div className="card">
                <DataTable ref={dt} value={articles} selection={selectedArticles} onSelectionChange={(e) => setSelectedArticles(e.value)}
                    dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column field="reference" header="Reference" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="nom_article" header="Nom" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="description" header="Description" sortable style={{ minWidth: '20rem' }}></Column>
                    <Column field="date_peremption" header="Date Peremption" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column header="Action" body={actionBodyTemplate}></Column>
                </DataTable>
            </div>

            <Dialog visible={articleDialog} style={{ width: '450px' }} header="Article Details" modal className="p-fluid" footer={articleDialogFooter} onHide={hideDialog}>
                {/* Input du details article */}
            </Dialog>

            <Dialog visible={deleteArticleDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteArticleDialogFooter} onHide={hideDeleteArticleDialog}>
                {/* Confirmation dialog*/}
            </Dialog>

            <Dialog visible={deleteArticlesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteArticlesDialogFooter} onHide={hideDeleteArticlesDialog}>
                {/* Confirmation dialog */}
            </Dialog>
        </div>
    );
}

export default AppCrudData;
