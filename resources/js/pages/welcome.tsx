import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:from-[#0a0a0a] dark:to-[#1b1b18]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <motion.main
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="flex w-full max-w-2xl flex-col items-center justify-center text-center lg:grow"
                >
                    <h1 className="text-4xl font-semibold leading-tight sm:text-5xl text-[#1b1b18] dark:text-[#EDEDEC] mb-4">
                        Selamat Datang di <span className="text-primary">Manago</span>
                    </h1>
                    <p className="text-lg text-[#3E3E3A] dark:text-[#B0B0AB] mb-6">
                        Aplikasi pintar untuk mencatat pengeluaran dan mengatur jadwal harian Anda.
                        Satu tempat untuk produktivitas dan kontrol keuangan yang lebih baik.
                    </p>
                    {!auth.user && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex gap-4"
                        >
                            <Link
                                href={route('register')}
                                className="inline-block rounded-md bg-[#1b1b18] px-6 py-2 text-sm font-medium text-white hover:bg-[#353530] dark:bg-white dark:text-[#1b1b18] dark:hover:bg-[#e5e5e5]"
                            >
                                Daftar Sekarang
                            </Link>
                            <Link
                                href={route('login')}
                                className="inline-block rounded-md border border-[#19140035] px-6 py-2 text-sm font-medium text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Sudah punya akun?
                            </Link>
                        </motion.div>
                    )}
                </motion.main>

                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
