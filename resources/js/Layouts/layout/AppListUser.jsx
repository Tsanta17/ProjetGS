import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

export default function BasicDemo() {
    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        role: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        site: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });

    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const imageBodyTemplate = (rowData) => {
        return <img alt="Profile" src={rowData.image} className="w-6 h-6" />;
    };

    const deleteButtonTemplate = (rowData) => {
        return <Button icon="pi pi-trash" className="p-button-danger" onClick={() => onDelete(rowData)} />;
    };

    const onDelete = (rowData) => {
        // Implement the delete functionality here
        console.log('Deleting customer', rowData);
    };

    const onGlobalFilterChange = (event) => {
        const value = event.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
    };

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={value || ''} onChange={onGlobalFilterChange} placeholder="Rechercher..." />
            </span>
        );
    };

    const header = renderHeader();

    return (
        <div className="card">
            <DataTable value={customers} paginator rows={5} header={header} filters={filters} onFilter={(e) => setFilters(e.filters)}
                    selection={selectedCustomer} onSelectionChange={(e) => setSelectedCustomer(e.value)} selectionMode="single" dataKey="id"
                    stateStorage="session" stateKey="dt-state-demo-local" emptyMessage="Vide" tableStyle={{ minWidth: '50rem' }}>
                <Column field="name" header="Name" sortable filter filterPlaceholder="Search" style={{ width: '20%' }}></Column>
                <Column field="email" header="Email" sortable filter filterPlaceholder="Search" style={{ width: '20%' }}></Column>
                <Column field="role" header="Role" sortable filter filterPlaceholder="Search" style={{ width: '20%' }}></Column>
                <Column field="site" header="Site" sortable filter filterPlaceholder="Search" style={{ width: '20%' }}></Column>
                <Column header="Profile Image" body={imageBodyTemplate} style={{ width: '10%' }}></Column>
                <Column body={deleteButtonTemplate} style={{ width: '10%' }}></Column>
            </DataTable>
        </div>
    );
}
