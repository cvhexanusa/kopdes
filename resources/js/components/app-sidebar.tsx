import { Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { BookOpen, FolderGit2, LayoutGrid, Users, Building, UserCheck } from 'lucide-react';
import { addUrlDefault } from '@/wayfinder';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const page = usePage();
    const user = (page.props as any).auth.user;

    useEffect(() => {
        if (user?.peran) {
            addUrlDefault('peran', user.peran);
        }
    }, [user?.peran]);
    
    // Dynamic role prefix
    const rolePrefix = `/${user.peran}`;
    const dashboardUrl = `${rolePrefix}/dashboard`;

    const isPengawas = user.peran === 'pengawas';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboardUrl,
            icon: LayoutGrid,
        },
    ];

    if (!isPengawas) {
        // Menu untuk Administrator
        mainNavItems.push(
            {
                title: 'Instansi',
                href: `${rolePrefix}/instansi`,
                icon: Building,
            },
            {
                title: 'Pengawas',
                href: `${rolePrefix}/pengawas`,
                icon: Users,
            },
            {
                title: 'Nasabah',
                href: `${rolePrefix}/nasabah`,
                icon: UserCheck,
            }
        );
    } else {
        // Menu untuk Pengawas
        mainNavItems.push(
            {
                title: 'Profil Instansi',
                href: user.instansi_id ? `${rolePrefix}/instansi/${user.instansi_id}` : `${rolePrefix}/instansi`,
                icon: Building,
            },
            {
                title: 'Nasabah',
                href: `${rolePrefix}/nasabah`,
                icon: UserCheck,
            }
        );
    }

    const footerNavItems: NavItem[] = [
        {
            title: 'Hexanusa',
            href: 'https://hexanusa.com',
            icon: FolderGit2,
        }
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
