import { prisma } from '../src/lib/prisma';
import { storageService } from '../src/lib/storage';
import { Buffer } from 'buffer';

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

    // 1. Clean data
    await prisma.product.deleteMany();
    await prisma.artist.deleteMany();

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
            const imageMetadata = await storageService.uploadFile({
                buffer,
                mimetype: 'image/jpeg',
                originalname: `${p.name.replace(/\s+/g, '-').toLowerCase()}.webp`,
                size: buffer.byteLength,
            } as any);

            // 3. Find or Create Artist
            const artist = await prisma.artist.upsert({
                where: { name: p.artist },
                update: {},
                create: { name: p.artist },
            });

            // 4. Create DB record with Join
            await prisma.product.create({
                data: {
                    title: p.name,
                    artist: { connect: { id: artist.id } },
                    images: {
                        create: {
                            url: imageMetadata.url,
                            width: imageMetadata.width,
                            height: imageMetadata.height,
                            size_bytes: imageMetadata.sizeBytes,
                            mime_type: imageMetadata.mimeType,
                            alt_text: `Cover art for ${p.name} by ${p.artist}`,
                            artist: { connect: { id: artist.id } },
                        }
                    }
                },
            });
        } catch (error) {
            console.error(`Failed to seed product "${p.name}":`, error);
        }
    }

    console.log('Successfully seeded normalized products! 🎸');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
