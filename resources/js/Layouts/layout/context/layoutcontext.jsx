import React, { useState, createContext } from 'react';

export const LayoutContext = createContext({});

export const LayoutProvider = ({ children }) => {
    const [layoutConfig, setLayoutConfig] = useState({
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'dark', // Set color scheme to dark
        theme: 'tailwind-dark', // Assuming 'tailwind-dark' is the dark theme
        scale: 14
    });

    const [layoutState, setLayoutState] = useState({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false
    });

    const [showForm, setShowForm] = useState(false);
    const [DataTable, setDataTable] = useState(false);
    const [showInsertCommmand, setShowInsertCommmand] = useState(false);
    const [picklistOrder, setPicklistOrder] = useState(false);
    const [showSupplier, setShowSupplier] = useState(false);
    const [showHisto, setShowHisto] = useState(false);
    
    const [showUserList, setShowUserList] = useState(false);
    const [showDelivery, setShowDelivery] = useState(false);
    const [showStock, setShowStock] = useState(false);
    const [showAffectation, setShowAffectation] = useState(false);
    const [showListAffectation, setshowListAffectation] = useState(false);

    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, overlayMenuActive: !prevLayoutState.overlayMenuActive }));
        }

        if (isDesktop()) {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive }));
        } else {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive }));
        }
    };

    const showProfileSidebar = () => {
        setLayoutState((prevLayoutState) => ({ ...prevLayoutState, profileSidebarVisible: !prevLayoutState.profileSidebarVisible }));
    };

    const isOverlay = () => {
        return layoutConfig.menuMode === 'overlay';
    };

    const isDesktop = () => {
        return window.innerWidth > 991;
    };

    const value = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        showProfileSidebar,
        showForm,
        setShowForm,
        DataTable, 
        setDataTable,
        showInsertCommmand, 
        setShowInsertCommmand,
        picklistOrder,
        setPicklistOrder,
        showSupplier, 
        setShowSupplier, 
        showHisto, 
        setShowHisto, 
        showUserList, 
        setShowUserList,
        showDelivery, 
        setShowDelivery, 
        showStock, 
        setShowStock, 
        showAffectation, 
        setShowAffectation,
        showListAffectation, 
        setshowListAffectation
    };

    return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};

