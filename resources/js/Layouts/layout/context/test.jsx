import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox'; // Importer le composant Checkbox
import '../../../css/layout.css';

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
            let _articles = [...articles];
            let _article = {...article};
            if (article.id) {
                const index = findIndexById(article.id);
                _articles[index] = _article;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Article Updated', life: 3000 });
            } else {
                _article.id = createId();
                _articles.push(_article);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Article Created', life: 3000 });
            }

            setArticles(_articles);
            setArticleDialog(false);
            setArticle(emptyArticle);
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
        let _articles = articles.filter(val => val.id !== article.id);
        setArticles(_articles);
        setDeleteArticleDialog(false);
        setArticle(emptyArticle);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Article Deleted', life: 3000 });
    }

    const deleteSelectedArticles = () => {
        let _articles = articles.filter(val => !selectedArticles.includes(val));
        setArticles(_articles);
        setDeleteArticlesDialog(false);
        setSelectedArticles([]);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Articles Deleted', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < articles.length; i++) {
            if (articles[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedArticles.length} />
            </React.Fragment>
        );
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" name="demo[]" auto url="https://primefaces.org/primereact/showcase/upload.php" accept=".csv" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={() => dt.current.exportCSV()} />
            </React.Fragment>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editArticle(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteArticle(rowData)} />
            </React.Fragment>
        );
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

    const confirmDeleteSelected = () => {
        setDeleteArticlesDialog(true);
    }

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={articles} selection={selectedArticles} onSelectionChange={(e) => setSelectedArticles(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column selectionMode="single" field="reference" header="Reference" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="nom_article" header="Nom" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="description" header="Description" sortable style={{ minWidth: '20rem' }}></Column>
                    <Column field="date_peremption" header="Date Peremption" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="statut" header="Statut" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
            </div>

            <Dialog visible={articleDialog} style={{ width: '450px' }} header="Article Details" modal className="p-fluid" footer={articleDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name">Nom</label>
                    <InputText id="name" value={article.nom_article} onChange={(e) => setArticle({ ...article, nom_article: e.target.value })} required autoFocus className={classNames({ 'p-invalid': submitted && !article.nom_article })} />
                    {submitted && !article.nom_article && <small className="p-invalid">Nom is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description">Description</label>
                    <InputTextarea id="description" value={article.description} onChange={(e) => setArticle({ ...article, description: e.target.value })} required rows={3} cols={20} />
                </div>
                <div className="field">
                    <label htmlFor="date_peremption">Date Peremption</label>
                    <InputText id="date_peremption" value={article.date_peremption} onChange={(e) => setArticle({ ...article, date_peremption: e.target.value })} required className={classNames({ 'p-invalid': submitted && !article.date_peremption })} />
                    {submitted && !article.date_peremption && <small className="p-invalid">Date Peremption is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="statut">Statut</label>
                    <InputText id="statut" value={article.statut} onChange={(e) => setArticle({ ...article, statut: e.target.value })} required className={classNames({ 'p-invalid': submitted && !article.statut })} />
                    {submitted && !article.statut && <small className="p-invalid">Statut is required.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteArticleDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteArticleDialogFooter} onHide={hideDeleteArticleDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {article && <span>Are you sure you want to delete <b>{article.nom_article}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteArticlesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteArticlesDialogFooter} onHide={hideDeleteArticlesDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {selectedArticles && <span>Are you sure you want to delete the selected articles?</span>}
                </div>
            </Dialog>
        </div>
    );
}

export default AppCrudData;
