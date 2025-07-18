import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Wallet, ListTodo, ChartLine, ShoppingCart, Bot } from 'lucide-react';
import AppLogo from './app-logo';
import { NavSecondary } from './nav-secondary';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Wallet',
        href: '/balances',

        icon: Wallet,
    },
    {
        title: 'Transaction',
        href: '/transactions',
        icon: ChartLine,
    },
    {
        title: 'Wishlist',
        href: '/wishlists',
        icon: ShoppingCart,
    },


];

const secondNav: NavItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
        icon: ListTodo,
    },
    {
        title: 'Journal',
        href: '/journals',
        icon: BookOpen,
    },
    {
        title: 'Ask AI',
        href: '/askai',
        icon: Bot,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/xisain',
        icon: Folder,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavSecondary items={secondNav}/>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
