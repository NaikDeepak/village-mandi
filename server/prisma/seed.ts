
import { prisma } from '../db';
import { UserRole, RelationshipLevel, BatchStatus } from '@prisma/client';

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Create Admin User
    const adminEmail = 'admin@villagemandi.com';
    const adminPhone = '9999999999';

    const admin = await prisma.user.upsert({
        where: { phone: adminPhone },
        update: {},
        create: {
            name: 'Super Admin',
            phone: adminPhone,
            email: adminEmail,
            role: UserRole.ADMIN,
        },
    });
    console.log('✅ Admin user ensured:', admin.name);

    // 2. Create Default Hub
    const hub = await prisma.hub.create({
        data: {
            name: 'Main Distribution Point',
            address: '123 Village Road, Near Mandi',
        },
    });
    console.log('✅ Hub created:', hub.name);

    // 3. Create Sample Farmer
    const farmer = await prisma.farmer.create({
        data: {
            name: 'Ramesh Kumar',
            location: 'Nasik',
            description: 'Expert in organic onions and grapes',
            relationshipLevel: RelationshipLevel.FAMILY,
        },
    });
    console.log('✅ Farmer created:', farmer.name);

    // 4. Create Sample Product
    const product = await prisma.product.create({
        data: {
            farmerId: farmer.id,
            name: 'Red Onions',
            unit: 'KG',
            description: 'Nashik Red Onions, medium size',
        },
    });
    console.log('✅ Product created:', product.name);

    console.log('🌱 Seeding COMPLETED.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
