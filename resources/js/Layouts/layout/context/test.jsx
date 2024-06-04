import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

export default function AppFormSupplier() {
    let emptySupplier = {
        id: null,
        nom_fournisseur: '',
        adresse_fournisseur: '',
        phone_fournisseur: '',
        email_fournisseur: ''
    };

    const [suppliers, setSuppliers] = useState([]);
    const [supplierDialog, setSupplierDialog] = useState(false);
    const [deleteSupplierDialog, setDeleteSupplierDialog] = useState(false);
    const [deleteSuppliersDialog, setDeleteSuppliersDialog] = useState(false);
    const [supplier, setSupplier] = useState(emptySupplier);
    const [selectedSuppliers, setSelectedSuppliers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
    axios.get('/fournisseur/list').then((response) => {
        if (Array.isArray(response.data)) {
            setSuppliers(response.data);
            console.log(response.data);
        } else {
            console.error('API response is not an array', response.data);
            setSuppliers([]);
        }
    }).catch(error => {
        console.error('Failed to fetch suppliers:', error);
        setSuppliers([]);
    });
}, []);

    const openNew = () => {
        setSupplier(emptySupplier);
        setSubmitted(false);
        setSupplierDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSupplierDialog(false);
    };

    const hideDeleteSupplierDialog = () => {
        setDeleteSupplierDialog(false);
    };

    const hideDeleteSuppliersDialog = () => {
        setDeleteSuppliersDialog(false);
    };

    const saveSupplier = async () => {
        setSubmitted(true);

        if (supplier.nom_fournisseur.trim()) {
            let _suppliers = [...suppliers];
            let _supplier = { ...supplier };

            if (supplier.id) {
                const index = findIndexById(supplier.id);

                _suppliers[index] = _supplier;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Supplier Updated', life: 3000 });
            } else {
                try {
                    const response = await axios.post('/fournisseur/create', _supplier);
                    _supplier.id = response.data.id; // Assuming the response contains the created supplier ID
                    _suppliers.push(_supplier);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Supplier Created', life: 3000 });
                } catch (error) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to create supplier', life: 3000 });
                }
            }

            setSuppliers(_suppliers);
            setSupplierDialog(false);
            setSupplier(emptySupplier);
        }
    };

    const editSupplier = (supplier) => {
        setSupplier({ ...supplier });
        setSupplierDialog(true);
    };

    const confirmDeleteSupplier = (supplier) => {
        setSupplier(supplier);
        setDeleteSupplierDialog(true);
    };

    const deleteSupplier = () => {
        let _suppliers = suppliers.filter((val) => val.id !== supplier.id);

        setSuppliers(_suppliers);
        setDeleteSupplierDialog(false);
        setSupplier(emptySupplier);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Supplier Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < suppliers.length; i++) {
            if (suppliers[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteSuppliersDialog(true);
    };

    const deleteSelectedSuppliers = () => {
        let _suppliers = suppliers.filter((val) => !selectedSuppliers.includes(val));

        setSuppliers(_suppliers);
        setDeleteSuppliersDialog(false);
        setSelectedSuppliers(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Suppliers Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _supplier = { ...supplier };

        _supplier[`${name}`] = val;

        setSupplier(_supplier);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedSuppliers || !selectedSuppliers.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editSupplier(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteSupplier(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Suppliers</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const supplierDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveSupplier} />
        </React.Fragment>
    );
    const deleteSupplierDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteSupplierDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSupplier} />
        </React.Fragment>
    );
    const deleteSuppliersDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteSuppliersDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedSuppliers} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={suppliers} selection={selectedSuppliers} onSelectionChange={(e) => setSelectedSuppliers(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} suppliers" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="nom_fournisseur" header="Nom du fournisseur" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="adresse_fournisseur" header="Adresse" sortable style={{ minWidth: '20rem' }}></Column>
                    <Column field="phone_fournisseur" header="Téléphone" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="email_fournisseur" header="Email" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>

            </div>

            <Dialog visible={supplierDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Supplier Details" modal className="p-fluid" footer={supplierDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="nom_fournisseur" className="font-bold">
                        Nom du fournisseur
                    </label>
                    <InputText id="nom_fournisseur" value={supplier.nom_fournisseur} onChange={(e) => onInputChange(e, 'nom_fournisseur')} required autoFocus className={classNames({ 'p-invalid': submitted && !supplier.nom_fournisseur })} />
                    {submitted && !supplier.nom_fournisseur && <small className="p-error">Nom du fournisseur est requis.</small>}
                </div>
                <div className="field">
                    <label htmlFor="adresse_fournisseur" className="font-bold">
                        Adresse
                    </label>
                    <InputText id="adresse_fournisseur" value={supplier.adresse_fournisseur} onChange={(e) => onInputChange(e, 'adresse_fournisseur')} required />
                </div>
                <div className="field">
                    <label htmlFor="phone_fournisseur" className="font-bold">
                        Téléphone
                    </label>
                    <InputText id="phone_fournisseur" value={supplier.phone_fournisseur} onChange={(e) => onInputChange(e, 'phone_fournisseur')} required />
                </div>
                <div className="field">
                    <label htmlFor="email_fournisseur" className="font-bold">
                        Email
                    </label>
                    <InputText id="email_fournisseur" value={supplier.email_fournisseur} onChange={(e) => onInputChange(e, 'email_fournisseur')} required />
                </div>
            </Dialog>

            <Dialog visible={deleteSupplierDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteSupplierDialogFooter} onHide={hideDeleteSupplierDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {supplier && (
                        <span>
                            Are you sure you want to delete <b>{supplier.nom_fournisseur}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteSuppliersDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteSuppliersDialogFooter} onHide={hideDeleteSuppliersDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {supplier && <span>Are you sure you want to delete the selected suppliers?</span>}
                </div>
            </Dialog>
        </div>
    );
}
