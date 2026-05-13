import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Building, MapPin, Calendar, Mail, Phone, Info, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Instansi {
    instansi_id: string;
    nama: string;
    desa: string;
    kecamatan: string;
    kabupaten: string;
    kode_pos: string;
    waktu_aktif: string | null;
}

interface Props {
    instansi: Instansi;
}

export default function InstansiShow({ instansi }: Props) {
    const { data, setData, put, processing } = useForm({
        nama: instansi.nama,
        desa: instansi.desa,
        kecamatan: instansi.kecamatan,
        kabupaten: instansi.kabupaten,
        kode_pos: instansi.kode_pos,
        waktu_aktif: instansi.waktu_aktif,
    });
    const page = usePage();
    const rolePrefix = `/${(page.props as any).auth.user.peran}`;

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`${rolePrefix}/instansi/${instansi.instansi_id}`);
    };

    return (
        <>
            <Head title={`Profil ${instansi.nama}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Profil Instansi</h1>
                        <p className="text-muted-foreground">Informasi lengkap mengenai instansi Anda.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Ringkasan Instansi */}
                    <Card className="md:col-span-1 border-none shadow-sm bg-primary/5">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                                    <Building className="h-10 w-10" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{instansi.nama}</h2>
                                    <p className="text-sm text-muted-foreground">{instansi.kabupaten}</p>
                                </div>
                                <Badge variant={instansi.waktu_aktif ? "default" : "secondary"} className="px-4 py-1">
                                    {instansi.waktu_aktif ? 'Aktif' : 'Non-Aktif'}
                                </Badge>
                                <div className="w-full pt-4 space-y-4 text-left">
                                    <div className="flex items-start gap-3 text-sm">
                                        <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                                        <div>
                                            <p className="font-medium">Lokasi</p>
                                            <p className="text-muted-foreground">{instansi.desa}, {instansi.kecamatan}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm">
                                        <Calendar className="h-4 w-4 mt-0.5 text-primary" />
                                        <div>
                                            <p className="font-medium">Terdaftar Sejak</p>
                                            <p className="text-muted-foreground">
                                                {instansi.waktu_aktif ? new Date(instansi.waktu_aktif).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detail & Edit Instansi */}
                    <Card className="md:col-span-2 shadow-sm">
                        <CardHeader className="border-b bg-muted/30">
                            <CardTitle className="flex items-center gap-2">
                                <Info className="h-5 w-5 text-primary" />
                                Detail Informasi
                            </CardTitle>
                            <CardDescription>Anda dapat memperbarui data instansi jika diperlukan.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={onSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nama">Nama Instansi</Label>
                                        <Input 
                                            id="nama" 
                                            value={data.nama} 
                                            onChange={e => setData('nama', e.target.value)}
                                            placeholder="Masukkan nama instansi"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="kabupaten">Kabupaten</Label>
                                        <Input 
                                            id="kabupaten" 
                                            value={data.kabupaten} 
                                            onChange={e => setData('kabupaten', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="kecamatan">Kecamatan</Label>
                                        <Input 
                                            id="kecamatan" 
                                            value={data.kecamatan} 
                                            onChange={e => setData('kecamatan', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="desa">Desa/Kelurahan</Label>
                                        <Input 
                                            id="desa" 
                                            value={data.desa} 
                                            onChange={e => setData('desa', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="kode_pos">Kode Pos</Label>
                                        <Input 
                                            id="kode_pos" 
                                            value={data.kode_pos} 
                                            onChange={e => setData('kode_pos', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4 border-t">
                                    <Button type="submit" disabled={processing} className="px-8 shadow-md">
                                        <Save className="h-4 w-4 mr-2" />
                                        Simpan Perubahan
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

InstansiShow.layout = (props: any) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Profil Instansi', href: '#' },
    ],
});
