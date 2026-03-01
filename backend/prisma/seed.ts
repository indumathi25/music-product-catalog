import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { storageService } from '../src/lib/storage';

const prisma = new PrismaClient();

const products = [
    { name: 'Abbey Road', artist: 'The Beatles' },
    { name: 'The Dark Side of the Moon', artist: 'Pink Floyd' },
    { name: 'Thriller', artist: 'Michael Jackson' },
    { name: 'Back in Black', artist: 'AC/DC' },
    { name: 'Rumours', artist: 'Fleetwood Mac' },
    { name: 'Nevermind', artist: 'Nirvana' },
    { name: 'Purple Rain', artist: 'Prince' },
    { name: 'Legend', artist: 'Bob Marley' },
    { name: 'Appetite for Destruction', artist: 'Guns N’ Roses' },
    { name: 'Ziggy Stardust', artist: 'David Bowie' },
    { name: 'Kind of Blue', artist: 'Miles Davis' },
    { name: 'Blue Train', artist: 'John Coltrane' },
    { name: 'A Love Supreme', artist: 'John Coltrane' },
    { name: 'Head Hunters', artist: 'Herbie Hancock' },
    { name: 'Bitches Brew', artist: 'Miles Davis' },
    { name: 'What’s Going On', artist: 'Marvin Gaye' },
    { name: 'Songs in the Key of Life', artist: 'Stevie Wonder' },
    { name: 'Interstellar Space', artist: 'John Coltrane' },
    { name: 'The Epic', artist: 'Kamasi Washington' },
    { name: 'To Pimp a Butterfly', artist: 'Kendrick Lamar' },
    { name: 'Madvillainy', artist: 'Madvillain' },
    { name: 'Enter the Wu-Tang', artist: 'Wu-Tang Clan' },
    { name: 'Illmatic', artist: 'Nas' },
    { name: 'Ready to Die', artist: 'The Notorious B.I.G.' },
    { name: 'All Eyez on Me', artist: '2Pac' },
    { name: 'Discovery', artist: 'Daft Punk' },
    { name: 'Random Access Memories', artist: 'Daft Punk' },
    { name: 'Music for the Jilted Generation', artist: 'The Prodigy' },
    { name: 'Selected Ambient Works 85-92', artist: 'Aphex Twin' },
    { name: 'Homework', artist: 'Daft Punk' },
    { name: 'A Rush of Blood to the Head', artist: 'Coldplay' },
    { name: 'Parachutes', artist: 'Coldplay' },
    { name: 'Everything Not Saved Will Be Lost', artist: 'Foals' },
    { name: 'Holy Fire', artist: 'Foals' },
    { name: 'Antidotes', artist: 'Foals' },
    { name: 'Is This It', artist: 'The Strokes' },
    { name: 'Whatever People Say I Am', artist: 'Arctic Monkeys' },
    { name: 'AM', artist: 'Arctic Monkeys' },
    { name: 'Currents', artist: 'Tame Impala' },
    { name: 'Lonerism', artist: 'Tame Impala' },
    { name: 'Innerspeaker', artist: 'Tame Impala' },
    { name: 'Ok Computer', artist: 'Radiohead' },
    { name: 'Kid A', artist: 'Radiohead' },
    { name: 'The Bends', artist: 'Radiohead' },
    { name: 'Dummy', artist: 'Portishead' },
    { name: 'Mezzanine', artist: 'Massive Attack' },
    { name: 'Blue Lines', artist: 'Massive Attack' },
    { name: 'Entroducing', artist: 'DJ Shadow' },
    { name: 'Pet Sounds', artist: 'The Beach Boys' },
    { name: 'Revolver', artist: 'The Beatles' },
];

async function main() {
    console.log(`Seeding ${products.length} products...`);

    // Clear existing products to ensure a clean state with S3 images
    await prisma.product.deleteMany();

    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const placeholderUrl = `https://loremflickr.com/400/400/music,album,art?lock=${i + 1}`;

        try {
            console.log(`[${i + 1}/${products.length}] Processing "${p.name}"...`);

            // 1. Fetch image
            const response = await fetch(placeholderUrl);
            if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // 2. Upload to S3 (Mocking Multer file object)
            const s3Url = await storageService.uploadFile({
                buffer,
                mimetype: 'image/jpeg',
                originalname: `${p.name.replace(/\s+/g, '-').toLowerCase()}.jpg`,
                size: buffer.byteLength,
            } as any);

            // 3. Create DB record
            await prisma.product.create({
                data: {
                    name: p.name,
                    artist_name: p.artist,
                    cover_url: s3Url,
                },
            });
        } catch (error) {
            console.error(`Failed to seed product "${p.name}":`, error);
        }
    }

    console.log('Successfully seeded products to DB and S3! 🎸');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
