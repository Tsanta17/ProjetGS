import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { PanelMenu } from 'primereact/panelmenu';
import { LayoutContext } from '@/Layouts/layout/context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { Link } from "@inertiajs/react";
import usePageState from './UsePageState'; // Import du hook personnalisé

const AppMenu = ({ userRole  }) => {
    const { layoutConfig, setShowForm, setDataTable, setShowInsertCommmand, setPicklistOrder, setShowSupplier, setShowHisto, setShowUserList, setShowDelivery, setShowStock, setShowAffectation, setshowListAffectation } = useContext(LayoutContext);
    const { currentPage, setPage } = usePageState(); // Utilisation du hook

    const handleMenuItemClick = (page) => {
        setPage(page);
        setShowForm(page === 'form');
        setDataTable(page === 'dataTable');
        setShowInsertCommmand(page === 'insertCommand');
        setPicklistOrder(page === 'picklistOrder');
        setShowSupplier(page === 'supplierForm');
        setShowHisto(page === 'historic');
        setShowUserList(page === 'userList');
        setShowDelivery(page === 'delivery');
        setShowStock(page === 'stock');
        setShowAffectation(page === 'affectation');
        setshowListAffectation(page === 'listAffectation');
    };

    const model = [
        {
            label: 'Menu',
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
                    visible: userRole == 'Admin',
                    items: [
                        {
                            label: 'New',
                            icon: 'pi pi-fw pi-plus',
                            to: route('register'),
                        },
                        {
                            label: 'Liste',
                            icon: 'pi pi-fw pi-list',
                            command: () => handleMenuItemClick('userList'),
                        }
                    ]
                },
                {
                    label: 'Articles',
                    icon: 'pi pi-fw pi-file',
                    items: [
                        {
                            label: 'Ajout d\'articles',
                            icon: 'pi pi-fw pi-plus',
                            to: route('article.page'),
                            command: () => handleMenuItemClick('form'),
                            visible: userRole !== 'Service'
                        },
                        {
                            label: 'Liste',
                            icon: 'pi pi-list',
                            command: () => handleMenuItemClick('dataTable')
                        }
                    ]
                },

                {
                    label: 'Commandes',
                    icon: 'pi pi-fw pi-tag',
                    items: [
                        {
                            label: 'Ajouter une commande',
                            icon: 'pi pi-fw pi-plus',
                            command: () => handleMenuItemClick('insertCommand'),
                        },
                        {
                            label: 'Gestion des commandes',
                            icon: 'pi pi-fw pi-file',
                            command: () => handleMenuItemClick('picklistOrder'),
                        }
                    ]
                },
                {
                    label: 'Livraison',
                    icon: 'pi pi-fw pi-cart-plus',
                    command: () => handleMenuItemClick('delivery'),
                },
                {
                    label: 'Affectation',
                    icon: 'pi pi-fw pi-arrows-h',
                    items: [
                        {
                            label: 'Demande affectation',
                            icon: 'pi pi-fw pi-arrows-h',
                            command: () => handleMenuItemClick('affectation'),
                        },
                        {
                            label: 'Liste & Validation',
                            icon: 'pi pi-fw pi-list',
                            command: () => handleMenuItemClick('listAffectation'),
                        }
                    ]
                },
                {
                    label: 'Fournisseur',
                    icon: 'pi pi-fw pi-arrow-right-arrow-left',
                    command: () => handleMenuItemClick('supplierForm'),
                    visible: userRole !== 'Service'
                },
                {
                    label: 'Stock',
                    icon: 'pi pi-fw pi-database',
                    command: () => handleMenuItemClick('stock'),
                },
                {
                    label: 'Historique',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick('historic'),
                    visible: userRole == 'Admin' 
                }
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                        if (!item?.separator) {
                            return (
                                <AppMenuitem
                                    item={item}
                                    root={true}
                                    index={i}
                                    key={item.label}
                                    visible={item.visible !== false} // Check visibility
                                />
                            );
                        } else {
                            return <li className="menu-separator" key={i}></li>;
                        }
                    })}
                {/* {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })} */}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
