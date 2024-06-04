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
                <h2>Delete Account</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Once your account is deleted, all of its resources and data will be permanently deleted. Before
                    deleting your account, please download any data or information that you wish to retain.
                </p>
            </header>

            <Button onClick={confirmUserDeletion} label="Delete Account" className="p-button-danger" />

            <Dialog
                visible={confirmingUserDeletion}
                onHide={closeModal}
                header="Are you sure you want to delete your account?"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button label="Cancel" onClick={closeModal} className="p-button-secondary" />
                        <Button
                            label="Delete Account"
                            onClick={deleteUser}
                            className="p-button-danger"
                            disabled={processing}
                        />
                    </div>
                }
            >
                <form onSubmit={deleteUser} className="p-fluid">
                    <p className="text-sm text-gray-600">
                        Once your account is deleted, all of its resources and data will be permanently deleted. Please
                        enter your password to confirm you would like to permanently delete your account.
                    </p>

                    <div className="mt-6">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <InputText
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={`mt-1 w-full ${errors.password ? 'p-invalid' : ''}`}
                            placeholder="Password"
                        />
                        {errors.password && <Messages severity="error" text={errors.password} />}
                    </div>
                </form>
            </Dialog>
        </div>
    );
}
