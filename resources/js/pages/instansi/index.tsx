import { Head, useForm, router, usePage } from '@inertiajs/react';
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
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import instansiRoutes from '@/routes/instansi';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/pagination';
import AddressSelector from '@/components/address-selector';

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
    instansis: {
        data: Instansi[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function InstansiIndex({ instansis, filters }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingInstansi, setEditingInstansi] = useState<Instansi | null>(null);
    const [deletingInstansiId, setDeletingInstansiId] = useState<string | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const page = usePage();

    const rolePrefix = `/${(page.props as any).auth.user.peran}`;

    const createForm = useForm({
        nama: '',
        desa: '',
        kecamatan: '',
        kabupaten: '',
        kode_pos: '',
        waktu_aktif: '',
    });

    const editForm = useForm({
        nama: '',
        desa: '',
        kecamatan: '',
        kabupaten: '',
        kode_pos: '',
        waktu_aktif: '',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(`${rolePrefix}/instansi`, { search }, { preserveState: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleAddressSelect = (data: { desa: string; kecamatan: string; kabupaten: string }) => {
        createForm.setData(prev => ({
            ...prev,
            desa: data.desa,
            kecamatan: data.kecamatan,
            kabupaten: data.kabupaten,
        }));
    };

    const handleEditAddressSelect = (data: { desa: string; kecamatan: string; kabupaten: string }) => {
        editForm.setData(prev => ({
            ...prev,
            desa: data.desa,
            kecamatan: data.kecamatan,
            kabupaten: data.kabupaten,
        }));
    };

    const onCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(instansiRoutes.store.url(), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const onEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingInstansi) return;
        editForm.put(instansiRoutes.update.url({ instansi: editingInstansi.instansi_id }), {
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
                setEditingInstansi(null);
            },
        });
    };

    const onDeleteSubmit = () => {
        if (!deletingInstansiId) return;
        router.delete(instansiRoutes.destroy.url({ instansi: deletingInstansiId }), {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setDeletingInstansiId(null);
            },
        });
    };

    return (
        <>
            <Head title="Data Instansi" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Instansi</h1>
                        <p className="text-muted-foreground">Kelola data instansi Anda di sini.</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Instansi
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <form onSubmit={onCreateSubmit}>
                                <DialogHeader>
                                    <DialogTitle>Tambah Instansi</DialogTitle>
                                    <DialogDescription>
                                        Masukkan informasi instansi baru.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="nama">Nama Instansi</Label>
                                        <Input
                                            id="nama"
                                            placeholder="Contoh: PT Maju Jaya"
                                            value={createForm.data.nama}
                                            onChange={(e) => createForm.setData('nama', e.target.value)}
                                            required
                                        />
                                    </div>
                                    
                                    <AddressSelector onSelect={handleAddressSelect} />

                                    <div className="grid gap-2">
                                        <Label htmlFor="kode_pos">Kode Pos</Label>
                                        <Input
                                            id="kode_pos"
                                            placeholder="Contoh: 12345"
                                            value={createForm.data.kode_pos}
                                            onChange={(e) => createForm.setData('kode_pos', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="waktu_aktif">Waktu Aktif</Label>
                                        <Input
                                            id="waktu_aktif"
                                            type="date"
                                            value={createForm.data.waktu_aktif}
                                            onChange={(e) => createForm.setData('waktu_aktif', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={createForm.processing}>
                                        Simpan
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari instansi..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-md border bg-card overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Nama</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Wilayah</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Kode Pos</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground whitespace-nowrap">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {instansis.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="h-24 text-center align-middle text-muted-foreground">
                                        Tidak ada data instansi.
                                    </td>
                                </tr>
                            ) : (
                                instansis.data.map((i) => (
                                    <tr key={i.instansi_id} className="border-b hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">{i.nama}</td>
                                        <td className="p-4 align-middle">
                                            {i.desa}, {i.kecamatan}, {i.kabupaten}
                                        </td>
                                        <td className="p-4 align-middle">{i.kode_pos}</td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => {
                                                        setEditingInstansi(i);
                                                        editForm.setData({
                                                            nama: i.nama,
                                                            desa: i.desa,
                                                            kecamatan: i.kecamatan,
                                                            kabupaten: i.kabupaten,
                                                            kode_pos: i.kode_pos,
                                                            waktu_aktif: i.waktu_aktif ? i.waktu_aktif.split('T')[0] : '',
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
                                                        setDeletingInstansiId(i.instansi_id);
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
                <Pagination links={instansis.links} />

                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={onEditSubmit}>
                            <DialogHeader>
                                <DialogTitle>Edit Instansi</DialogTitle>
                                <DialogDescription>Ubah informasi instansi.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-nama">Nama Instansi</Label>
                                    <Input
                                        id="edit-nama"
                                        placeholder="Nama Instansi"
                                        value={editForm.data.nama}
                                        onChange={(e) => editForm.setData('nama', e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <AddressSelector 
                                    onSelect={handleEditAddressSelect} 
                                    initialValues={{
                                        desa: editForm.data.desa,
                                        kecamatan: editForm.data.kecamatan,
                                        kabupaten: editForm.data.kabupaten
                                    }}
                                />

                                <div className="grid gap-2">
                                    <Label htmlFor="edit-kode_pos">Kode Pos</Label>
                                    <Input
                                        id="edit-kode_pos"
                                        value={editForm.data.kode_pos}
                                        onChange={(e) => editForm.setData('kode_pos', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-waktu_aktif">Waktu Aktif</Label>
                                    <Input
                                        id="edit-waktu_aktif"
                                        type="date"
                                        value={editForm.data.waktu_aktif}
                                        onChange={(e) => editForm.setData('waktu_aktif', e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={editForm.processing}>
                                    Update
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Konfirmasi Hapus</DialogTitle>
                            <DialogDescription>
                                Apakah Anda yakin ingin menghapus instansi ini? Ini akan berdampak pada nasabah dan pengawas yang terdaftar di instansi ini.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                                Batal
                            </Button>
                            <Button variant="destructive" onClick={onDeleteSubmit}>
                                Hapus
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

InstansiIndex.layout = (props: any) => ({
    breadcrumbs: [
        {
            title: 'Instansi',
            href: `/instansi`,
        },
    ],
});
