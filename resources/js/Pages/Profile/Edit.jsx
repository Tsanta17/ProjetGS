import React from 'react';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Layout from '@/Layouts/layout/layout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <Layout
            user={auth.user}
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card className="p-4 sm:p-8 bg-grey shadow sm:rounded-lg">
                        <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} className="max-w-xl" />
                    </Card>

                    <Card className="p-4 sm:p-8 bg-grey shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </Card>

                    <Card className="p-4 sm:p-8 bg-grey shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
