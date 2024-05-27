import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { PanelMenu } from 'primereact/panelmenu';
// import { LayoutContext } from './context/layoutcontext';
import { LayoutContext } from '@/Layouts/layout/context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import {Link} from "@inertiajs/react";

const AppMenu = () => {
    const { layoutConfig, setShowForm } = useContext(LayoutContext);

    const model = [
        {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: route('dashboard'),  command: () => {
                  // Logique pour afficher le Dashboard
                  setShowForm(false);
              } },
                {
                    label:'Utilisateur',
                    icon:'pi pi-user',
                    items:[
                       {
                          label:'New',
                          icon:'pi pi-fw pi-plus',
                          to: route('register'),
                       },
                       {
                          label:'Liste',
                          icon:'pi pi-fw pi-file',
                       },
                       {
                          label:'Delete',
                          icon:'pi pi-fw pi-trash'
                       },
                    ]
                 },
                {
                    label:'Articles',
                    icon:'pi pi-fw pi-file',
                    items:[
                       {
                          label:'New',
                          icon:'pi pi-fw pi-plus',
                          command: () => {
                           // Logique pour afficher le Form
                           setShowForm(true);
                       }
                       },
                       {
                          label:'Delete',
                          icon:'pi pi-fw pi-trash'
                       },
                       {
                          label:'Export',
                          icon:'pi pi-fw pi-external-link'
                       }
                    ]
                 },
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
