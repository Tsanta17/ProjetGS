import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { PanelMenu } from 'primereact/panelmenu';
import { LayoutContext } from '@/Layouts/layout/context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { Link } from "@inertiajs/react";
import usePageState from './UsePageState'; // Import du hook personnalisé

const AppMenu = () => {
    const { layoutConfig, setShowForm, setDataTable, setShowInsertCommmand } = useContext(LayoutContext);
    const { currentPage, setPage } = usePageState(); // Utilisation du hook

    const handleMenuItemClick = (page) => {
        setPage(page);
        setShowForm(page === 'form');
        setDataTable(page === 'dataTable');
        setShowInsertCommmand(page === 'insertCommand');
    };

    const model = [
        {
            label: 'Home',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-fw pi-home',
                    to: route('dashboard'),
                    command: () => handleMenuItemClick('dashboard')
                },
                {
                    label: 'Utilisateur',
                    icon: 'pi pi-user',
                    items: [
                        {
                            label: 'New',
                            icon: 'pi pi-fw pi-plus',
                            to: route('register'),
                        },
                        {
                            label: 'Liste',
                            icon: 'pi pi-fw pi-file',
                        },
                        {
                            label: 'Delete',
                            icon: 'pi pi-fw pi-trash'
                        },
                    ]
                },
                {
                    label: 'Articles',
                    icon: 'pi pi-fw pi-file',
                    items: [
                        {
                            label: 'Ajout d\'articles',
                            icon: 'pi pi-fw pi-plus',
                            command: () => handleMenuItemClick('form')
                        },
                        {
                            label: 'Delete',
                            icon: 'pi pi-fw pi-trash'
                        },
                        {
                            label: 'Export',
                            icon: 'pi pi-fw pi-external-link',
                            command: () => handleMenuItemClick('dataTable')
                        }
                    ]
                },

                {
                    label: 'Commandes',
                    icon: 'pi pi-fw pi-thumbtack',
                    items: [
                        {
                            label: 'Ajouter une commande',
                            icon: 'pi pi-fw pi-plus',
                            command: () => handleMenuItemClick('insertCommand'),
                        },
                        {
                            label: 'Liste',
                            icon: 'pi pi-fw pi-file',
                        }
                    ]
                }
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
