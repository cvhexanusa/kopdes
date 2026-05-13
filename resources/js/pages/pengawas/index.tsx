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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import pengawasRoutes from '@/routes/pengawas';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/pagination';

interface Instansi {
    instansi_id: string;
    nama: string;
}

interface User {
    id: number;
    users_id: string;
    name: string;
    email: string;
    instansi_id: string | null;
    instansi?: Instansi;
}

interface Props {
    pengawas: {
        data: User[];
        links: any[];
    };
    instansis: Instansi[];
    filters: {
        search?: string;
    };
}

export default function PengawasIndex({ pengawas, instansis, filters }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingPengawas, setEditingPengawas] = useState<User | null>(null);
    const [deletingPengawasId, setDeletingPengawasId] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const page = usePage();
    const rolePrefix = `/${(page.props as any).auth.user.peran}`;

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        instansi_id: '',
    });

    const editForm = useForm({
        name: '',
        email: '',
        instansi_id: '',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(`${rolePrefix}/pengawas`, { search }, { preserveState: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const onCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(pengawasRoutes.store.url(), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const onEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPengawas) return;
        editForm.put(pengawasRoutes.update.url(editingPengawas.id), {
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
                setEditingPengawas(null);
            },
        });
    };

    const onDeleteSubmit = () => {
        if (!deletingPengawasId) return;
        router.delete(pengawasRoutes.destroy.url(deletingPengawasId), {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setDeletingPengawasId(null);
            },
        });
    };

    return (
        <>
            <Head title="Data Pengawas" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Data Pengawas</h1>
                        <p className="text-muted-foreground">Kelola data pengawas (User dengan peran pengawas).</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Pengawas
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={onCreateSubmit}>
                                <DialogHeader>
                                    <DialogTitle>Tambah Pengawas</DialogTitle>
                                    <DialogDescription>
                                        Buat akun pengawas baru.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nama Lengkap</Label>
                                        <Input
                                            id="name"
                                            placeholder="Masukkan nama lengkap pengawas"
                                            value={createForm.data.name}
                                            onChange={(e) => createForm.setData('name', e.target.value)}
                                            required
                                        />
                                        {createForm.errors.name && (
                                            <p className="text-sm text-destructive">{createForm.errors.name}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="contoh@kopdesss.com"
                                            value={createForm.data.email}
                                            onChange={(e) => createForm.setData('email', e.target.value)}
                                            required
                                        />
                                        {createForm.errors.email && (
                                            <p className="text-sm text-destructive">{createForm.errors.email}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Minimal 8 karakter"
                                            value={createForm.data.password}
                                            onChange={(e) => createForm.setData('password', e.target.value)}
                                            required
                                        />
                                        {createForm.errors.password && (
                                            <p className="text-sm text-destructive">{createForm.errors.password}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Instansi</Label>
                                        <Select 
                                            value={createForm.data.instansi_id} 
                                            onValueChange={(value) => createForm.setData('instansi_id', value)}
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
                                        {createForm.errors.instansi_id && (
                                            <p className="text-sm text-destructive">{createForm.errors.instansi_id}</p>
                                        )}
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

                <div className="flex items-center gap-2 max-w-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari pengawas..."
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
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Instansi</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pengawas.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="h-24 text-center align-middle text-muted-foreground">
                                        Tidak ada data pengawas.
                                    </td>
                                </tr>
                            ) : (
                                pengawas.data.map((p) => (
                                    <tr key={p.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">{p.name}</td>
                                        <td className="p-4 align-middle">{p.email}</td>
                                        <td className="p-4 align-middle">{p.instansi?.nama || '-'}</td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => {
                                                        setEditingPengawas(p);
                                                        editForm.setData({
                                                            name: p.name,
                                                            email: p.email,
                                                            instansi_id: p.instansi_id || '',
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
                                                        setDeletingPengawasId(p.id);
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
                <Pagination links={pengawas.links} />

                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <form onSubmit={onEditSubmit}>
                            <DialogHeader>
                                <DialogTitle>Edit Pengawas</DialogTitle>
                                <DialogDescription>Ubah data pengawas.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Nama Lengkap</Label>
                                    <Input
                                        id="edit-name"
                                        placeholder="Nama lengkap pengawas"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        required
                                    />
                                    {editForm.errors.name && (
                                        <p className="text-sm text-destructive">{editForm.errors.name}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        placeholder="Email pengawas"
                                        value={editForm.data.email}
                                        onChange={(e) => editForm.setData('email', e.target.value)}
                                        required
                                    />
                                    {editForm.errors.email && (
                                        <p className="text-sm text-destructive">{editForm.errors.email}</p>
                                    )}
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
                                    {editForm.errors.instansi_id && (
                                        <p className="text-sm text-destructive">{editForm.errors.instansi_id}</p>
                                    )}
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
                                Apakah Anda yakin ingin menghapus pengawas ini? Tindakan ini tidak dapat dibatalkan.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                                Batal
                            </Button>
                            <Button variant="destructive" onClick={onDeleteSubmit} disabled={createForm.processing}>
                                Hapus
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

PengawasIndex.layout = (props: any) => ({
    breadcrumbs: [
        {
            title: 'Pengawas',
            href: '/pengawas',
        },
    ],
});
