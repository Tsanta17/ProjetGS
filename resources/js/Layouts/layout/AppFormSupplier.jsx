import React, { useState, useEffect, useRef } from 'react';
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
        name: '',
        address: '',
        phone: '',
        email: ''
    };

    const [suppliers, setSuppliers] = useState(null);
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
        // Fetch initial supplier data from an API
        // Example:
        // axios.get('/api/suppliers').then((response) => setSuppliers(response.data));
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

    const saveSupplier = () => {
        setSubmitted(true);

        if (supplier.name.trim()) {
            let _suppliers = [...suppliers];
            let _supplier = { ...supplier };

            if (supplier.id) {
                const index = findIndexById(supplier.id);

                _suppliers[index] = _supplier;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Supplier Updated', life: 3000 });
            } else {
                _supplier.id = createId();
                _suppliers.push(_supplier);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Supplier Created', life: 3000 });
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

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
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
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} suppliers" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="name" header="Nom du fournisseur" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="address" header="Adresse" sortable style={{ minWidth: '20rem' }}></Column>
                    <Column field="phone" header="Téléphone" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="email" header="Email" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={supplierDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Supplier Details" modal className="p-fluid" footer={supplierDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nom du fournisseur
                    </label>
                    <InputText id="name" value={supplier.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !supplier.name })} />
                    {submitted && !supplier.name && <small className="p-error">Nom du fournisseur est requis.</small>}
                </div>
                <div className="field">
                    <label htmlFor="address" className="font-bold">
                        Adresse
                    </label>
                    <InputText id="address" value={supplier.address} onChange={(e) => onInputChange(e, 'address')} required />
                </div>
                <div className="field">
                    <label htmlFor="phone" className="font-bold">
                        Téléphone
                    </label>
                    <InputText id="phone" value={supplier.phone} onChange={(e) => onInputChange(e, 'phone')} required />
                </div>
                <div className="field">
                    <label htmlFor="email" className="font-bold">
                        Email
                    </label>
                    <InputText id="email" value={supplier.email} onChange={(e) => onInputChange(e, 'email')} required />
                </div>
            </Dialog>

            <Dialog visible={deleteSupplierDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteSupplierDialogFooter} onHide={hideDeleteSupplierDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {supplier && (
                        <span>
                            Are you sure you want to delete <b>{supplier.name}</b>?
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
