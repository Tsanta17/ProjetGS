import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Messages } from 'primereact/messages';
import { useForm } from '@inertiajs/react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        reset();
    };

    return (
        <div className="card">
            <header>
                <h2>Suppresssion du compte</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Une fois votre compte est supprimé, tous les données seront détruites. Avant de supprimer,
                    téléchargez tous les données ou informations que vous voulez obtenir.
                </p>
            </header>

            <Button onClick={confirmUserDeletion} label="Supprimer" className="p-button-danger" />

            <Dialog
                visible={confirmingUserDeletion}
                onHide={closeModal}
                header="Vous êtes sûr de vouloir supprimer votre compte?"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button label="Annuler" onClick={closeModal} className="p-button-secondary" />
                        <Button
                            label="Supprimer"
                            onClick={deleteUser}
                            className="p-button-danger"
                            disabled={processing}
                        />
                    </div>
                }
            >
                <form onSubmit={deleteUser} className="p-fluid">
                    <p className="text-sm text-gray-600">
                        Une fois votre compte est supprimé, tous les données seront détruites. Entrez
                        votre mot de passe pour confirmer la suppression de votre compte.
                    </p>

                    <div className="mt-6">
                        <label htmlFor="password" className="sr-only">Mot de passe</label>
                        <InputText
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={`mt-1 w-full ${errors.password ? 'p-invalid' : ''}`}
                            placeholder="Mot de passe"
                        />
                        {errors.password && <Messages severity="error" text={errors.password} />}
                    </div>
                </form>
            </Dialog>
        </div>
    );
}
