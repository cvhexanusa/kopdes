import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, CreditCard, Home, MapPin, Calendar, Phone, Briefcase, Building } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Instansi {
    instansi_id: string;
    nama: string;
}

interface Nasabah {
    nasabah_id: string;
    nama: string;
    nik: string;
    domisili: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    no_handphone: string;
    pekerjaan: string;
    foto_ktp: string | null;
    foto_kk: string | null;
    instansi_id: string;
    instansi?: Instansi;
    created_at: string;
}

interface Props {
    nasabah: Nasabah;
}

export default function NasabahShow({ nasabah }: Props) {
    return (
        <>
            <Head title={`Detail ${nasabah.nama}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/nasabah">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Profil Nasabah</h1>
                        <p className="text-muted-foreground">Detail informasi pendaftaran nasabah.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sidebar Profil */}
                    <div className="md:col-span-1 space-y-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-12 w-12 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{nasabah.nama}</h2>
                                        <p className="text-sm text-muted-foreground">{nasabah.pekerjaan}</p>
                                    </div>
                                    <Badge variant="secondary" className="px-3 py-1">
                                        Nasabah Terdaftar
                                    </Badge>
                                    <div className="w-full pt-4 border-t space-y-3 text-left">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>Terdaftar pada {new Date(nasabah.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Building className="h-4 w-4 text-muted-foreground" />
                                            <span>Instansi: {nasabah.instansi?.nama || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Informasi Utama */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Pribadi</CardTitle>
                                <CardDescription>Data identitas sesuai kartu pengenal.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CreditCard className="h-4 w-4" />
                                        <span>NIK (Nomor Induk Kependudukan)</span>
                                    </div>
                                    <p className="text-base font-medium">{nasabah.nik}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>Tempat, Tanggal Lahir</span>
                                    </div>
                                    <p className="text-base font-medium">{nasabah.tempat_lahir}, {nasabah.tanggal_lahir}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        <span>Nomor Handphone</span>
                                    </div>
                                    <p className="text-base font-medium">{nasabah.no_handphone}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Briefcase className="h-4 w-4" />
                                        <span>Pekerjaan</span>
                                    </div>
                                    <p className="text-base font-medium">{nasabah.pekerjaan}</p>
                                </div>
                                <div className="col-span-full space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Home className="h-4 w-4" />
                                        <span>Alamat Domisili</span>
                                    </div>
                                    <p className="text-base font-medium leading-relaxed">{nasabah.domisili}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bagian Foto */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Foto KTP</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {nasabah.foto_ktp ? (
                                        <div className="relative group overflow-hidden rounded-lg border bg-muted aspect-video flex items-center justify-center">
                                            <img 
                                                src={nasabah.foto_ktp.startsWith('nasabah/') 
                                                    ? `/storage/${nasabah.foto_ktp}` 
                                                    : `https://drive.google.com/thumbnail?id=${nasabah.foto_ktp}&sz=w800`} 
                                                alt="KTP" 
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    onClick={() => window.open(
                                                        nasabah.foto_ktp?.startsWith('nasabah/') 
                                                        ? `/storage/${nasabah.foto_ktp}` 
                                                        : `https://drive.google.com/uc?id=${nasabah.foto_ktp}`, 
                                                        '_blank'
                                                    )}
                                                >
                                                    Lihat Full HD
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-video rounded-lg border border-dashed flex items-center justify-center text-muted-foreground italic text-sm">
                                            Foto tidak tersedia
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Foto Kartu Keluarga</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {nasabah.foto_kk ? (
                                        <div className="relative group overflow-hidden rounded-lg border bg-muted aspect-video flex items-center justify-center">
                                            <img 
                                                src={nasabah.foto_kk.startsWith('nasabah/') 
                                                    ? `/storage/${nasabah.foto_kk}` 
                                                    : `https://drive.google.com/thumbnail?id=${nasabah.foto_kk}&sz=w800`} 
                                                alt="KK" 
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    onClick={() => window.open(
                                                        nasabah.foto_kk?.startsWith('nasabah/') 
                                                        ? `/storage/${nasabah.foto_kk}` 
                                                        : `https://drive.google.com/uc?id=${nasabah.foto_kk}`, 
                                                        '_blank'
                                                    )}
                                                >
                                                    Lihat Full HD
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-video rounded-lg border border-dashed flex items-center justify-center text-muted-foreground italic text-sm">
                                            Foto tidak tersedia
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

NasabahShow.layout = (props: any) => ({
    breadcrumbs: [
        { title: 'Nasabah', href: '/nasabah' },
        { title: 'Detail Profil', href: '#' },
    ],
});
