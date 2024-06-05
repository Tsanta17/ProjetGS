import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '@/Layouts/layout/context/layoutcontext';
import Layout from "@/Layouts/layout/layout.jsx";
import DashboardInfoCard from "@/components/DashboardInfoCard.jsx";
import AppForm from "@/Layouts/layout/AppForm";
import AppCrudData from "@/Layouts/layout/AppCrudData";
import AppInsertCommand from '@/Layouts/layout/AppInsertCommand';
import AppCheckOrder from '@/Layouts/layout/AppCheckOrder';
import AppFormSupplier from '@/Layouts/layout/AppFormSupplier';
import AppHistoric from '@/Layouts/layout/AppHistoric';
import AppListUser from '@/Layouts/layout/AppListUser';



const Dashboard = ({fournisseurs, articles, couts, commandeParMois, budgetTotalParMois, articlePerime, topArticles, totalCommandes}) => {
    const { layoutConfig, showForm, DataTable, showInsertCommmand, picklistOrder, showSupplier, showHisto, showUserList } = useContext(LayoutContext);
    const [lineOptions, setLineOptions] = useState({});

    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        console.log(topArticles);
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme, topArticles]);

    const lineData = {
        labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Jul', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Nombre de commandes',
                data: Object.values(commandeParMois),
                fill: false,
                backgroundColor: '#2f4860',
                borderColor: '#2f4860',
                tension: 0.4
            },
            {
                label: 'Total de budget',
                data: Object.values(budgetTotalParMois),
                fill: false,
                backgroundColor: '#00bb7e',
                borderColor: '#00bb7e',
                tension: 0.4
            }
        ]
    };

    return (
        <Layout>
            <div className="grid">
                <DashboardInfoCard title="Fournisseurs"
                    value={fournisseurs}
                    icon="pi pi-fw pi-arrow-right-arrow-left"
                    iconColor="purple"
                    descriptionValue="24 "
                    descriptionText="nouveaux">
                </DashboardInfoCard>
                <DashboardInfoCard title="Articles"
                    value={articles}
                    icon="pi pi-fw pi-file"
                    iconColor="orange"
                    descriptionValue="2+"
                    descriptionText="depuis une semaine">
                </DashboardInfoCard>
                <DashboardInfoCard title="Coût" value={couts}
                    descriptionValue="520"
                    icon="pi pi-dollar"
                    iconColor="cyan"
                    descriptionText="commandes">
                </DashboardInfoCard>
                <DashboardInfoCard title="Périmés" value={articlePerime}
                    descriptionValue="85"
                    icon="pi pi-calendar-times"
                    iconColor="red"
                    descriptionText="réponses">
                </DashboardInfoCard>


                {showForm ? (
                    <div className="col-12 xl:col-12">
                        <div className="card">
                            <AppForm />
                        </div>
                    </div>
                ) : DataTable ? (
                    <div className="col-12 xl:col-12">
                        <div className="card">
                            <AppCrudData />
                        </div>
                    </div>
                ) : showInsertCommmand ? (
                    <div className="col-12 xl:col-12">
                        <div className="card">
                            <AppInsertCommand />
                        </div>
                    </div>
                ) : picklistOrder ? (
                    <div className="col-12 xl:col-12">
                        <div className="card">
                            <AppCheckOrder />
                        </div>
                    </div>
                ) : showSupplier ? (
                    <div className="col-12 xl:col-12">
                        <div className="card">
                            <AppFormSupplier />
                        </div>
                    </div>
                ) : showHisto ? (
                    <div className="col-12 xl:col-12">
                        <div className="card">
                            <AppHistoric />
                        </div>
                    </div>
                ) : showUserList ? (
                    <div className="col-12 xl:col-12">
                        <div className="card">
                            <AppListUser />
                        </div>
                    </div>
                ) : (

                    <>
                        <div className="col-12 xl:col-6">
                            <div className="card">
                                <h5>Statistique des commandes</h5>
                                <Chart type="line" data={lineData} options={lineOptions} />
                            </div>
                        </div>

                        <div className="col-12 xl:col-6">
                            <div className="card">
                                <div className="flex justify-content-between align-items-center mb-5">
                                    <h5>Top commandes</h5>

                                </div>
                                <ul className="list-none p-0 m-0">

                                    {topArticles.map((articles, index) => (
                                        <li key={index} className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                            <div>
                                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{articles.nom_article}</span>
                                                <div className="mt-1 text-600">{articles.total_commandes}</div>
                                            </div>
                                            <div className="mt-2 md:mt-0 flex align-items-center">
                                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                                                    style={{ height: '8px' }}>
                                                    <div className={`bg-${['cyan', 'orange', 'pink'][index % 3]}-500 h-full`} style={{ width: `${((articles.total_commandes / totalCommandes) * 100).toFixed(2)} %` }} />
                                                </div>
                                                <span className={`text-${['cyan', 'orange', 'pink'][index % 3]}-500 ml-3 font-medium`}>%{((articles.total_commandes / totalCommandes) * 100).toFixed(2)}</span>
                                            </div>
                                        </li>
                                    ))}

                                    
                                </ul>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </Layout>
    );
};

export default Dashboard;
