import React, { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface LocationItem {
    id: string;
    name: string;
}

interface AddressSelectorProps {
    onSelect: (data: {
        province: string;
        kabupaten: string;
        kecamatan: string;
        desa: string;
    }) => void;
    initialValues?: {
        province?: string;
        kabupaten?: string;
        kecamatan?: string;
        desa?: string;
    };
}

const API_BASE = 'https://www.emsifa.com/api-wilayah-indonesia/api';

/**
 * Clean up location names by removing prefixes like KABUPATEN or KOTA for display
 */
const formatLocationName = (name: string) => {
    return name.replace(/^(KABUPATEN|KOTA)\s+/i, '').trim();
};

/**
 * Sort items alphabetically by name
 */
const sortByName = (items: LocationItem[]) => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
};

export default function AddressSelector({ onSelect, initialValues }: AddressSelectorProps) {
    const [provinces, setProvinces] = useState<LocationItem[]>([]);
    const [regencies, setRegencies] = useState<LocationItem[]>([]);
    const [districts, setDistricts] = useState<LocationItem[]>([]);
    const [villages, setVillages] = useState<LocationItem[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedRegency, setSelectedRegency] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedVillage, setSelectedVillage] = useState<string>('');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE}/provinces.json`)
            .then(res => res.json())
            .then(data => setProvinces(sortByName(data)));
    }, []);

    useEffect(() => {
        if (!initialValues || provinces.length === 0) return;

        // Find province by name
        // We handle cases where only kabupaten/kecamatan/desa are provided (like in Instansi)
        // by defaulting province to West Java (Jawa Barat) if missing, since this app is for KopDes
        const targetProvince = initialValues.province || 'JAWA BARAT';
        const province = provinces.find(p => p.name.toUpperCase() === targetProvince.toUpperCase());
        
        if (province && !selectedProvince) {
            setSelectedProvince(province.id);
            
            fetch(`${API_BASE}/regencies/${province.id}.json`)
                .then(res => res.json())
                .then(regencyData => {
                    const sortedRegencies = sortByName(regencyData);
                    setRegencies(sortedRegencies);
                    
                    const regency = sortedRegencies.find(r => 
                        formatLocationName(r.name).toUpperCase() === initialValues.kabupaten?.toUpperCase() ||
                        r.name.toUpperCase() === initialValues.kabupaten?.toUpperCase()
                    );
                    
                    if (regency) {
                        setSelectedRegency(regency.id);
                        
                        fetch(`${API_BASE}/districts/${regency.id}.json`)
                            .then(res => res.json())
                            .then(districtData => {
                                const sortedDistricts = sortByName(districtData);
                                setDistricts(sortedDistricts);
                                
                                const district = sortedDistricts.find(d => d.name.toUpperCase() === initialValues.kecamatan?.toUpperCase());
                                if (district) {
                                    setSelectedDistrict(district.id);
                                    
                                    fetch(`${API_BASE}/villages/${district.id}.json`)
                                        .then(res => res.json())
                                        .then(villageData => {
                                            const sortedVillages = sortByName(villageData);
                                            setVillages(sortedVillages);
                                            
                                            const village = sortedVillages.find(v => v.name.toUpperCase() === initialValues.desa?.toUpperCase());
                                            if (village) {
                                                setSelectedVillage(village.id);
                                            }
                                        });
                                }
                            });
                    }
                });
        }
    }, [provinces, initialValues]);

    const handleProvinceChange = (id: string) => {
        setSelectedProvince(id);
        setSelectedRegency('');
        setSelectedDistrict('');
        setSelectedVillage('');
        setRegencies([]);
        setDistricts([]);
        setVillages([]);
        
        setLoading(true);
        fetch(`${API_BASE}/regencies/${id}.json`)
            .then(res => res.json())
            .then(data => {
                setRegencies(sortByName(data));
                setLoading(false);
            });
    };

    const handleRegencyChange = (id: string) => {
        setSelectedRegency(id);
        setSelectedDistrict('');
        setSelectedVillage('');
        setDistricts([]);
        setVillages([]);
        
        setLoading(true);
        fetch(`${API_BASE}/districts/${id}.json`)
            .then(res => res.json())
            .then(data => {
                setDistricts(sortByName(data));
                setLoading(false);
            });
    };

    const handleDistrictChange = (id: string) => {
        setSelectedDistrict(id);
        setSelectedVillage('');
        setVillages([]);
        
        setLoading(true);
        fetch(`${API_BASE}/villages/${id}.json`)
            .then(res => res.json())
            .then(data => {
                setVillages(sortByName(data));
                setLoading(false);
            });
    };

    const handleVillageChange = (id: string) => {
        setSelectedVillage(id);
        
        const provinceName = provinces.find(p => p.id === selectedProvince)?.name || '';
        const regencyName = regencies.find(r => r.id === selectedRegency)?.name || '';
        const districtName = districts.find(d => d.id === selectedDistrict)?.name || '';
        const villageName = villages.find(v => v.id === id)?.name || '';

        onSelect({
            province: provinceName,
            kabupaten: regencyName,
            kecamatan: districtName,
            desa: villageName
        });
    };

    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label>Provinsi</Label>
                <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Provinsi" />
                    </SelectTrigger>
                    <SelectContent>
                        {provinces.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label>Kabupaten/Kota</Label>
                <Select 
                    value={selectedRegency} 
                    onValueChange={handleRegencyChange}
                    disabled={!selectedProvince || loading}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Kabupaten/Kota" />
                    </SelectTrigger>
                    <SelectContent>
                        {regencies.map(r => (
                            <SelectItem key={r.id} value={r.id}>
                                {formatLocationName(r.name)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label>Kecamatan</Label>
                <Select 
                    value={selectedDistrict} 
                    onValueChange={handleDistrictChange}
                    disabled={!selectedRegency || loading}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Kecamatan" />
                    </SelectTrigger>
                    <SelectContent>
                        {districts.map(d => (
                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label>Desa/Kelurahan</Label>
                <Select 
                    value={selectedVillage} 
                    onValueChange={handleVillageChange}
                    disabled={!selectedDistrict || loading}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Desa/Kelurahan" />
                    </SelectTrigger>
                    <SelectContent>
                        {villages.map(v => (
                            <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
