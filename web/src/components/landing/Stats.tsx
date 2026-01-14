import { Wheat, Package, MapPin } from 'lucide-react';

// These would typically come from an API, but for now they're placeholders
const stats = [
    {
        label: 'Partner Farmers',
        value: '6+',
        icon: Wheat,
        description: 'Trusted farmers from known villages',
    },
    {
        label: 'Products Available',
        value: '6',
        icon: Package,
        description: 'Mango, Rice, Jaggery, Tur Dal, Jowar, Supari',
    },
    {
        label: 'Sourcing Regions',
        value: '3+',
        icon: MapPin,
        description: 'Karnataka & Maharashtra',
    },
];

export function Stats() {
    return (
        <div className="py-16 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-mandi-cream mb-4">
                                <stat.icon className="h-6 w-6 text-mandi-green" aria-hidden="true" />
                            </div>
                            <div className="text-3xl font-bold text-mandi-dark mb-1">{stat.value}</div>
                            <div className="text-sm font-medium text-mandi-green uppercase tracking-wide mb-2">{stat.label}</div>
                            <div className="text-sm text-mandi-muted">{stat.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
