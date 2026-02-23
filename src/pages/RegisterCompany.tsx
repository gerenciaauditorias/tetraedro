import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@services/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Building2, User, Briefcase } from 'lucide-react';

const registerSchema = z.object({
    // Company Data
    company_name: z.string().min(3, 'El nombre de la empresa es requerido'),
    company_cuit: z.string().min(11, 'CUIT inválido (11 dígitos)'),
    company_fiscal_address: z.string().min(5, 'Dirección fiscal requerida'),
    company_real_address: z.string().min(5, 'Dirección real requerida'),
    company_phone: z.string().min(8, 'Teléfono requerido'),
    company_responsable: z.string().min(3, 'Nombre del responsable requerido'),
    company_vat_condition: z.string().min(1, 'Condición de IVA requerida'),
    company_employee_count: z.number().min(1, 'Cantidad de empleados requerida'),

    // User Data
    full_name: z.string().min(3, 'Nombre completo requerido'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterCompany = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            company_employee_count: 1
        }
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: response, error } = await (supabase as any).rpc('register_tenant', {
                email: data.email,
                password: data.password,
                full_name: data.full_name,
                company_name: data.company_name,
                company_cuit: data.company_cuit,
                company_fiscal_address: data.company_fiscal_address,
                company_real_address: data.company_real_address,
                company_phone: data.company_phone,
                company_responsable: data.company_responsable,
                company_vat_condition: data.company_vat_condition,
                company_employee_count: data.company_employee_count
            }) as {
                data: { access_token: string; refresh_token: string | null };
                error: Error | null;
            };

            if (error) throw error;

            // Auto login with the returned token
            const { error: sessionError } = await supabase.auth.setSession({
                access_token: response.access_token,
                refresh_token: response.refresh_token || '',
            });

            if (sessionError) throw sessionError;

            toast.success('Empresa registrada exitosamente!');
            navigate('/dashboard');

        } catch (error: any) {
            console.error('Registration error:', error);
            toast.error(error.message || 'Error al registrar la empresa');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
                        <Building2 className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Registrar Nueva Empresa
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Complete los datos de la organización y del administrador
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                        {/* Sección Empresa */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <Briefcase className="mr-2 h-5 w-5 text-blue-500" />
                                Datos de la Empresa
                            </h3>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Razón Social</label>
                                    <input type="text" {...register('company_name')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                    {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">CUIT</label>
                                    <input type="text" {...register('company_cuit')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                    {errors.company_cuit && <p className="text-red-500 text-xs mt-1">{errors.company_cuit.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Condición IVA</label>
                                    <select {...register('company_vat_condition')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                        <option value="">Seleccione...</option>
                                        <option value="Responsable Inscripto">Responsable Inscripto</option>
                                        <option value="Monotributo">Monotributo</option>
                                        <option value="Exento">Exento</option>
                                        <option value="Consumidor Final">Consumidor Final</option>
                                    </select>
                                    {errors.company_vat_condition && <p className="text-red-500 text-xs mt-1">{errors.company_vat_condition.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cantidad Empleados</label>
                                    <input type="number" {...register('company_employee_count', { valueAsNumber: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                    {errors.company_employee_count && <p className="text-red-500 text-xs mt-1">{errors.company_employee_count.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Dirección Fiscal</label>
                                    <input type="text" {...register('company_fiscal_address')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                    {errors.company_fiscal_address && <p className="text-red-500 text-xs mt-1">{errors.company_fiscal_address.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Dirección Real</label>
                                    <input type="text" {...register('company_real_address')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                    {errors.company_real_address && <p className="text-red-500 text-xs mt-1">{errors.company_real_address.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                    <input type="text" {...register('company_phone')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                    {errors.company_phone && <p className="text-red-500 text-xs mt-1">{errors.company_phone.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Responsable</label>
                                    <input type="text" {...register('company_responsable')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                    {errors.company_responsable && <p className="text-red-500 text-xs mt-1">{errors.company_responsable.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Sección Admin */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <User className="mr-2 h-5 w-5 text-blue-500" />
                                Datos del Administrador
                            </h3>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                                    <input type="text" {...register('full_name')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                    {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" {...register('email')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                                    <input type="password" {...register('password')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                                    <input type="password" {...register('confirmPassword')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? 'Registrando...' : 'Registrar Empresa'}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
                                ¿Ya tienes cuenta? Iniciar Sesión
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
