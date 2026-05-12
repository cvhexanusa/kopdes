import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2, Search } from 'lucide-react';
import nasabahRoutes from '@/routes/nasabah';
import Pagination from '@/components/pagination';

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
}

interface Props {
    nasabahs: {
        data: Nasabah[];
        links: any[];
    };
    instansis: Instansi[];
    filters: {
        search?: string;
    };
}

export default function NasabahIndex({ nasabahs, instansis, filters }: Props) {
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedNasabah, setSelectedNasabah] = useState<Nasabah | null>(null);
    const [deletingNasabahId, setDeletingNasabahId] = useState<string | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    const editForm = useForm({
        nama: '',
        nik: '',
        domisili: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        no_handphone: '',
        pekerjaan: '',
        instansi_id: '',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get('/nasabah', { search }, { preserveState: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const onEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedNasabah) return;
        editForm.put(nasabahRoutes.update.url(selectedNasabah.nasabah_id), {
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
                setSelectedNasabah(null);
            },
        });
    };

    const onDeleteSubmit = () => {
        if (!deletingNasabahId) return;
        router.delete(nasabahRoutes.destroy.url(deletingNasabahId), {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setDeletingNasabahId(null);
            },
        });
    };

    return (
        <>
            <Head title="Data Nasabah" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Data Nasabah</h1>
                        <p className="text-muted-foreground">Kelola data nasabah yang masuk melalui sistem.</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 max-w-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nasabah (Nama/NIK)..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-md border bg-card">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 transition-colors">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">NIK</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Pekerjaan</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Instansi</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nasabahs.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="h-24 text-center align-middle text-muted-foreground">
                                        Tidak ada data nasabah.
                                    </td>
                                </tr>
                            ) : (
                                nasabahs.data.map((n) => (
                                    <tr key={n.nasabah_id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">{n.nama}</td>
                                        <td className="p-4 align-middle">{n.nik}</td>
                                        <td className="p-4 align-middle">{n.pekerjaan}</td>
                                        <td className="p-4 align-middle">{n.instansi?.nama || '-'}</td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedNasabah(n);
                                                        setIsViewOpen(true);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedNasabah(n);
                                                        editForm.setData({
                                                            nama: n.nama,
                                                            nik: n.nik,
                                                            domisili: n.domisili,
                                                            tempat_lahir: n.tempat_lahir,
                                                            tanggal_lahir: n.tanggal_lahir,
                                                            no_handphone: n.no_handphone,
                                                            pekerjaan: n.pekerjaan,
                                                            instansi_id: n.instansi_id,
                                                        });
                                                        setIsEditOpen(true);
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => {
                                                        setDeletingNasabahId(n.nasabah_id);
                                                        setIsDeleteOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={nasabahs.links} />

                {/* View Dialog */}
                <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Detail Nasabah</DialogTitle>
                        </DialogHeader>
                        {selectedNasabah && (
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground">Nama Lengkap</Label>
                                    <p className="font-medium">{selectedNasabah.nama}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground">NIK</Label>
                                    <p className="font-medium">{selectedNasabah.nik}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground">Tempat, Tanggal Lahir</Label>
                                    <p className="font-medium">{selectedNasabah.tempat_lahir}, {selectedNasabah.tanggal_lahir}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground">No. Handphone</Label>
                                    <p className="font-medium">{selectedNasabah.no_handphone}</p>
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <Label className="text-muted-foreground">Domisili</Label>
                                    <p className="font-medium">{selectedNasabah.domisili}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground">Pekerjaan</Label>
                                    <p className="font-medium">{selectedNasabah.pekerjaan}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground">Instansi</Label>
                                    <p className="font-medium">{selectedNasabah.instansi?.nama || '-'}</p>
                                </div>

                                <div className="col-span-2 grid grid-cols-2 gap-4 mt-4">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Foto KTP</Label>
                                        {selectedNasabah.foto_ktp ? (
                                            <div className="border rounded-md overflow-hidden bg-muted aspect-[3/2] flex items-center justify-center">
                                                <img 
                                                    src={`https://drive.google.com/thumbnail?id=${selectedNasabah.foto_ktp}&sz=w500`} 
                                                    alt="KTP" 
                                                    className="w-full h-full object-cover cursor-pointer"
                                                    onClick={() => window.open(`https://drive.google.com/uc?id=${selectedNasabah.foto_ktp}`, '_blank')}
                                                />
                                            </div>
                                        ) : (
                                            <div className="border rounded-md bg-muted aspect-[3/2] flex items-center justify-center text-xs text-muted-foreground italic">
                                                Tidak ada foto
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Foto KK</Label>
                                        {selectedNasabah.foto_kk ? (
                                            <div className="border rounded-md overflow-hidden bg-muted aspect-[3/2] flex items-center justify-center">
                                                <img 
                                                    src={`https://drive.google.com/thumbnail?id=${selectedNasabah.foto_kk}&sz=w500`} 
                                                    alt="KK" 
                                                    className="w-full h-full object-cover cursor-pointer"
                                                    onClick={() => window.open(`https://drive.google.com/uc?id=${selectedNasabah.foto_kk}`, '_blank')}
                                                />
                                            </div>
                                        ) : (
                                            <div className="border rounded-md bg-muted aspect-[3/2] flex items-center justify-center text-xs text-muted-foreground italic">
                                                Tidak ada foto
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={() => setIsViewOpen(false)}>Tutup</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={onEditSubmit}>
                            <DialogHeader>
                                <DialogTitle>Edit Nasabah</DialogTitle>
                                <DialogDescription>Perbarui informasi nasabah.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="nama">Nama Lengkap</Label>
                                    <Input
                                        id="nama"
                                        value={editForm.data.nama}
                                        onChange={(e) => editForm.setData('nama', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="nik">NIK</Label>
                                    <Input
                                        id="nik"
                                        value={editForm.data.nik}
                                        onChange={(e) => editForm.setData('nik', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="no_handphone">No. Handphone</Label>
                                    <Input
                                        id="no_handphone"
                                        value={editForm.data.no_handphone}
                                        onChange={(e) => editForm.setData('no_handphone', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="pekerjaan">Pekerjaan</Label>
                                    <Input
                                        id="pekerjaan"
                                        value={editForm.data.pekerjaan}
                                        onChange={(e) => editForm.setData('pekerjaan', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Instansi</Label>
                                    <Select 
                                        value={editForm.data.instansi_id} 
                                        onValueChange={(value) => editForm.setData('instansi_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Instansi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {instansis.map((i) => (
                                                <SelectItem key={i.instansi_id} value={i.instansi_id}>
                                                    {i.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={editForm.processing}>Update</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Konfirmasi Hapus</DialogTitle>
                            <DialogDescription>Apakah Anda yakin ingin menghapus data nasabah ini?</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
                            <Button variant="destructive" onClick={onDeleteSubmit}>Hapus</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

NasabahIndex.layout = (props: any) => ({
    breadcrumbs: [
        {
            title: 'Nasabah',
            href: '/nasabah',
        },
    ],
});
