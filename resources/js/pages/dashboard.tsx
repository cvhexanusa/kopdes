import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Building, Users, Calendar, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Nasabah {
    nasabah_id: string;
    nama: string;
    nik: string;
    pekerjaan: string;
    created_at: string;
    instansi?: {
        nama: string;
    };
}

interface Stats {
    total_nasabah: number;
    total_instansi: number;
    total_pengawas: number;
}

interface Props {
    stats: Stats;
    recent_nasabah: Nasabah[];
}

export default function Dashboard({ stats, recent_nasabah }: Props) {
    const page = usePage();
    const rolePrefix = `/${(page.props as any).auth.user.peran}`;
    const user = (page.props as any).auth.user;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">Selamat Datang, {user.name}</h1>
                    <p className="text-muted-foreground">Berikut adalah ringkasan data sistem koperasi hari ini.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="relative overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Nasabah</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_nasabah}</div>
                            <p className="text-xs text-muted-foreground mt-1">Nasabah terdaftar di sistem</p>
                        </CardContent>
                        <div className="absolute bottom-0 right-0 p-2 opacity-5">
                            <Users className="h-12 w-12" />
                        </div>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Instansi</CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_instansi}</div>
                            <p className="text-xs text-muted-foreground mt-1">Instansi yang bekerja sama</p>
                        </CardContent>
                        <div className="absolute bottom-0 right-0 p-2 opacity-5">
                            <Building className="h-12 w-12" />
                        </div>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pengawas</CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_pengawas}</div>
                            <p className="text-xs text-muted-foreground mt-1">Petugas pengawas aktif</p>
                        </CardContent>
                        <div className="absolute bottom-0 right-0 p-2 opacity-5">
                            <User className="h-12 w-12" />
                        </div>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Pendaftaran Terbaru</CardTitle>
                            <CardDescription>Nasabah yang baru saja mendaftar ke sistem.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`${rolePrefix}/nasabah`}>
                                Lihat Semua
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50 transition-colors">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama Nasabah</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">NIK</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Instansi</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tanggal</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent_nasabah.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="h-24 text-center align-middle text-muted-foreground">
                                                Belum ada data pendaftaran terbaru.
                                            </td>
                                        </tr>
                                    ) : (
                                        recent_nasabah.map((nasabah) => (
                                            <tr key={nasabah.nasabah_id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-middle font-medium">{nasabah.nama}</td>
                                                <td className="p-4 align-middle">{nasabah.nik}</td>
                                                <td className="p-4 align-middle">{nasabah.instansi?.nama || '-'}</td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                                        {new Date(nasabah.created_at).toLocaleDateString('id-ID')}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    <Button variant="ghost" size="icon" asChild title="Lihat Detail">
                                                        <Link href={`${rolePrefix}/nasabah/${nasabah.nasabah_id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = (props: any) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: `/${props.auth.user.peran}/dashboard`,
        },
    ],
});
