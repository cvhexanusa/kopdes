import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, CreditCard, Home, MapPin, Calendar, Phone, Briefcase, Building, Printer, Download, Upload, Loader2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { useRef } from 'react';

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
    jenis_kelamin: string;
    no_handphone: string;
    pekerjaan: string;
    foto_ktp: string | null;
    foto_kk: string | null;
    instansi_id: string;
    instansi?: Instansi;
    created_at: string;
    updated_at: string;
}

interface Props {
    nasabah: Nasabah;
}

export default function NasabahShow({ nasabah }: Props) {
    const page = usePage();
    const rolePrefix = `/${(page.props as any).auth.user.peran}`;
    const ktpInputRef = useRef<HTMLInputElement>(null);
    const kkInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing } = useForm({
        _method: 'PUT',
        nama: nasabah.nama,
        nik: nasabah.nik,
        domisili: nasabah.domisili,
        tempat_lahir: nasabah.tempat_lahir,
        tanggal_lahir: nasabah.tanggal_lahir,
        jenis_kelamin: nasabah.jenis_kelamin,
        no_handphone: nasabah.no_handphone,
        pekerjaan: nasabah.pekerjaan,
        instansi_id: nasabah.instansi_id,
        foto_ktp: null as File | null,
        foto_kk: null as File | null,
    });

    const handlePhotoUpdate = (type: 'ktp' | 'kk', file: File) => {
        // Prepare current data plus the new file
        const updateData = {
            _method: 'PUT',
            nama: nasabah.nama,
            nik: nasabah.nik,
            domisili: nasabah.domisili,
            tempat_lahir: nasabah.tempat_lahir,
            tanggal_lahir: nasabah.tanggal_lahir,
            jenis_kelamin: nasabah.jenis_kelamin,
            no_handphone: nasabah.no_handphone,
            pekerjaan: nasabah.pekerjaan,
            instansi_id: nasabah.instansi_id,
            foto_ktp: type === 'ktp' ? file : null,
            foto_kk: type === 'kk' ? file : null,
        };

        router.post(`${rolePrefix}/nasabah/${nasabah.nasabah_id}`, updateData, {
            forceFormData: true,
            onSuccess: () => {
                // Berhasil
            },
        });
    };

    const downloadFile = (path: string | null, filename: string) => {
        if (!path) return;
        const url = path.startsWith('nasabah/') 
            ? `/storage/${path}` 
            : `https://drive.google.com/uc?id=${path}`;
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <>
            <Head title={`Detail ${nasabah.nama}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`${rolePrefix}/nasabah`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Profil Nasabah</h1>
                        <p className="text-muted-foreground">Detail informasi pendaftaran nasabah.</p>
                    </div>
                    <Button asChild variant="default" title="Cetak PDF Nasabah">
                        <a href={`${rolePrefix}/nasabah/${nasabah.nasabah_id}/pdf`} target="_blank">
                            <Printer className="h-4 w-4 mr-2" />
                            Cetak PDF
                        </a>
                    </Button>
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
                                        <User className="h-4 w-4" />
                                        <span>Jenis Kelamin</span>
                                    </div>
                                    <p className="text-base font-medium">{nasabah.jenis_kelamin}</p>
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
                            {/* Card KTP */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg">Foto KTP</CardTitle>
                                    <div className="flex gap-2">
                                        <input 
                                            type="file" 
                                            ref={ktpInputRef} 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={(e) => e.target.files?.[0] && handlePhotoUpdate('ktp', e.target.files[0])}
                                        />
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8"
                                            onClick={() => ktpInputRef.current?.click()}
                                            disabled={processing}
                                            title="Unggah/Ganti Foto KTP"
                                        >
                                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8"
                                            onClick={() => downloadFile(nasabah.foto_ktp, `KTP_${nasabah.nama}.jpg`)}
                                            disabled={!nasabah.foto_ktp}
                                            title="Download Foto KTP"
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
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
                                        </div>
                                    ) : (
                                        <div className="aspect-video rounded-lg border border-dashed flex items-center justify-center text-muted-foreground italic text-sm">
                                            Foto tidak tersedia
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Card KK */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg">Foto Kartu Keluarga</CardTitle>
                                    <div className="flex gap-2">
                                        <input 
                                            type="file" 
                                            ref={kkInputRef} 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={(e) => e.target.files?.[0] && handlePhotoUpdate('kk', e.target.files[0])}
                                        />
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8"
                                            onClick={() => kkInputRef.current?.click()}
                                            disabled={processing}
                                            title="Unggah/Ganti Foto KK"
                                        >
                                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8"
                                            onClick={() => downloadFile(nasabah.foto_kk, `KK_${nasabah.nama}.jpg`)}
                                            disabled={!nasabah.foto_kk}
                                            title="Download Foto KK"
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
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
