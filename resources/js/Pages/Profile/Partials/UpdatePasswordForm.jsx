import React, { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { useForm } from '@inertiajs/react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef(null);
    const currentPasswordInput = useRef(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <div className="card">
            <header>
                <h2>Update Password</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">Current Password</label>
                    <InputText
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className={`mt-1 w-full ${errors.current_password ? 'p-invalid' : ''}`}
                        autoComplete="current-password"
                    />
                    {errors.current_password && <Messages severity="error" text={errors.current_password} />}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                    <InputText
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className={`mt-1 w-full ${errors.password ? 'p-invalid' : ''}`}
                        autoComplete="new-password"
                    />
                    {errors.password && <Messages severity="error" text={errors.password} />}
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <InputText
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="mt-1 w-full"
                        autoComplete="new-password"
                    />
                    {errors.password_confirmation && <Messages severity="error" text={errors.password_confirmation} />}
                </div>

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing} label="Save" className="w-32" />
                    {recentlySuccessful && <p className="text-sm text-gray-600">Saved.</p>}
                </div>
            </form>
        </div>
    );
}
