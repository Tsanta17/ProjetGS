import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    useEffect(() => {
        // Focus on the first input when component mounts
        document.getElementById('name').focus();
    }, []);

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <div className="card">
            <header>
                <h2>Profile Information</h2>
                <p className="mt-1 text-sm text-gray-600">Update your account's profile information and email address.</p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <InputText
                        id="name"
                        className={`mt-1 w-full ${errors.name ? 'p-invalid' : ''}`}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        autoComplete="name"
                    />
                    {errors.name && <Messages severity="error" text={errors.name} />}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <InputText
                        id="email"
                        type="email"
                        className={`mt-1 w-full ${errors.email ? 'p-invalid' : ''}`}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="username"
                    />
                    {errors.email && <Messages severity="error" text={errors.email} />}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <a
                                href={route('verification.send')}
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </a>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing} label="Save" className="w-32" />
                    {recentlySuccessful && <p className="text-sm text-gray-600">Saved.</p>}
                </div>
            </form>
        </div>
    );
}
