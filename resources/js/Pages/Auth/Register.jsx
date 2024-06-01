import React, { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import GuestLayout from '@/Layouts/GuestLayout';
import axios from 'axios';
import { Head, Link } from '@inertiajs/react';
import '../../../css/FormDemo.css';

export default function Register() {
    const { data, setData, post, processing, errors, reset, setError } = useForm({
        name: '',
        email: '',
        role: '',
        site: '',
        image_profile: null,
        password: '',
        password_confirmation: '',
    });

    const { props } = usePage();
    const { var: role } = props;
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('role', data.role);
        formData.append('site', data.site);
        formData.append('password', data.password);
        formData.append('password_confirmation', data.password_confirmation);
        if (data.image_profile) {
            formData.append('image_profile', data.image_profile);
        }

        // Débogage : Afficher les données du formulaire dans la console
        for (var pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            const response = await axios.post(route('register.store'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setFormData(data);
            setShowMessage(true);
            reset();
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const responseErrors = error.response.data.errors;
                Object.keys(responseErrors).forEach(key => {
                    setError(key, responseErrors[key][0]);
                });
            } else {
                console.error('There was an error registering the user:', error);
            }
        }
    };

    const handleFileChange = (e) => {
        setData('image_profile', e.files[0]);
    };

    const roleOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Service', value: 'service' }
    ];

    const siteOptions = [
        { label: 'Ploufragan', value: 'ploufragan' },
        { label: 'Quimper', value: 'quimper' },
        { label: 'Brest', value: 'brest' },
        { label: 'Fougères', value: 'fougere' },
        { label: 'Combourg', value: 'combourg' }
    ];

    const isFormFieldValid = (name) => !!errors[name];
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{errors[name]}</small>;
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;
    const passwordHeader = <h6>Pick a password</h6>;
    const passwordFooter = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </React.Fragment>
    );

    return (
        <div className="form-demo">
            <Head title="Register" />

            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex align-items-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Registration Successful!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Your account is registered under name <b>{formData.name}</b> ; it'll be valid next 30 days without activation. Please check <b>{formData.email}</b> for activation instructions.
                    </p>
                </div>
            </Dialog>

            <div className="flex justify-content-center">
                <div className="card">
                    <h5 className="text-center">Register</h5>
                    <form onSubmit={submit} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <InputText id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('name') })} />
                                <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid('name') })}>Name*</label>
                            </span>
                            {getFormErrorMessage('name')}
                        </div>

                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <InputText id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={classNames({ 'p-invalid': isFormFieldValid('email') })} />
                                <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid('email') })}>Email*</label>
                            </span>
                            {getFormErrorMessage('email')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Password id="password" value={data.password} onChange={(e) => setData('password', e.target.value)} toggleMask
                                    className={classNames({ 'p-invalid': isFormFieldValid('password') })} header={passwordHeader} footer={passwordFooter} />
                                <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid('password') })}>Password*</label>
                            </span>
                            {getFormErrorMessage('password')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Password id="password_confirmation" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} toggleMask
                                    className={classNames({ 'p-invalid': isFormFieldValid('password_confirmation') })} />
                                <label htmlFor="password_confirmation" className={classNames({ 'p-error': isFormFieldValid('password_confirmation') })}>Confirm Password*</label>
                            </span>
                            {getFormErrorMessage('password_confirmation')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Dropdown id="role" value={data.role} options={roleOptions} onChange={(e) => setData('role', e.value)} placeholder="Select Role" className={classNames({ 'p-invalid': isFormFieldValid('role') })} />
                                <label htmlFor="role" className={classNames({ 'p-error': isFormFieldValid('role') })}>Role*</label>
                            </span>
                            {getFormErrorMessage('role')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Dropdown id="site" value={data.site} options={siteOptions} onChange={(e) => setData('site', e.value)} placeholder="Select Site" className={classNames({ 'p-invalid': isFormFieldValid('site') })} />
                                <label htmlFor="site" className={classNames({ 'p-error': isFormFieldValid('site') })}>Site*</label>
                            </span>
                            {getFormErrorMessage('site')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <FileUpload name="image_profile" customUpload uploadHandler={handleFileChange} accept="image/*" mode="basic" className={classNames({ 'p-invalid': isFormFieldValid('image_profile') })} />
                                <label htmlFor="image_profile" className={classNames({ 'p-error': isFormFieldValid('image_profile') })}>Photo de Profil</label>
                            </span>
                            {getFormErrorMessage('image_profile')}
                        </div>

                        <Button type="submit" label="Register" icon="pi pi-user" className="mt-2" loading={processing} />
                    </form>
                </div>
            </div>
        </div>
    );
}
