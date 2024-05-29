import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import axios from 'axios';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: '', // Nouveau champ
        site: '', // Nouveau champ     
        profile_picture: null, // Nouveau champ pour l'image de profil
        password: '',
        password_confirmation: '',
    });

    const { props } = usePage();
    const { var: role } = props;

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
        if (data.profile_picture) {
            formData.append('profile_picture', data.profile_picture);
        }

        try {
            const response = await axios.post(route('register.store'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            console.log('User registered successfully:', response.data);
        } catch (error) {
            console.error('There was an error registering the user:', error);
        }
        // console.log(post(route('register.store')));
    };

    const handleFileChange = (e) => {
        setData('profile_picture', e.target.files[0]);
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Nouveau champ de sélection de rôle */}
                <div className="mt-4">
                    <InputLabel htmlFor="role" value="Role" />
                    <select
                        id="role"
                        name="role"
                        value={data.role}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        onChange={(e) => setData('role', e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="user">User</option>
                    </select>
                    <InputError message={errors.role} className="mt-2" />
                </div>

                {/* Nouveau champ de sélection de site */}
                <div className="mt-4">
                    <InputLabel htmlFor="site" value="Site" />
                    <select
                        id="site"
                        name="site"
                        value={data.site}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        onChange={(e) => setData('site', e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Site</option>
                        <option value="hr">HR</option>
                        <option value="engineering">Engineering</option>
                    </select>
                    <InputError message={errors.site} className="mt-2" />
                </div>

                {/* Champ de téléchargement de fichier pour l'image de profil */}
                <div className="mt-4">
                    <InputLabel htmlFor="profile_picture" value="Photo de Profil" />
                    <input
                        id="profile_picture"
                        type="file"
                        name="profile_picture"
                        accept="image/*"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        onChange={handleFileChange}
                    />
                    <InputError message={errors.profile_picture} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                <p>The role is: {role}</p>
                    <Link
                        href={route('login')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Already registered?
                    </Link>
                    <PrimaryButton className="ml-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
