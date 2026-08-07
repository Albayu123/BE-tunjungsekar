/**
 * Production & Development Seeder untuk Web Profil Kampung Mbois RW 01 Kelurahan Tunjungsekar.
 * Mengisi data asli berdasarkan Dokumen Resmi Kampung Mbois RW 01 Tunjungsekar Kota Malang.
 * Supabase Postgres Best Practice: Batch Inserts (createMany) untuk meminimalkan network round-trips.
 * Jalankan: npm run seed:dummy
 */

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/db.ts';

async function main() {
  console.log('Seeding data resmi Kampung Mbois RW 01 Tunjungsekar...');

  // 1. USER ADMIN (Single role admin)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: await bcrypt.hash('admin123', 10),
    },
  });
  console.log('✓ User admin:', admin.username);

  // 2. PROFILE RW 01 (Singleton)
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {
      sejarah:
        'Nama Mbesuk Ambyaar berasal dari nama Pedukuhan Asli Lawas, di mana setiap RT memiliki keragaman dalam mengelola lingkungan sekitar. AMBYAAR merupakan singkatan dari: Amanah, Manfaat, Berkarya, Yakin, Asri, Aman, dan Rukun.',
      visi:
        'Menjadi kampung yang berdaya dan mandiri dengan pemimpin yang Amanah agar dapat berManfaat, terus Berkarya dengan keYakinan, sehingga RW 01 menjadi Asri, Aman, Rukun, dan Gotong Royong.',
      misi:
        '1. Menjaga kepemimpinan yang Amanah dan berManfaat.\n2. Mendorong warga untuk terus Berkarya.\n3. Mewujudkan lingkungan RW 01 yang Asri, Aman, dan Rukun melalui semangat Gotong Royong.',
      alamat: 'Balai RW 01, Jl. Ikan Piranha Atas, Kel. Tunjungsekar, Kec. Lowokwaru, Kota Malang',
      kontakTelp: '081234567890',
      kontakEmail: 'rw01tunjungsekar@gmail.com',
    },
    create: {
      sejarah:
        'Nama Mbesuk Ambyaar berasal dari nama Pedukuhan Asli Lawas, di mana setiap RT memiliki keragaman dalam mengelola lingkungan sekitar. AMBYAAR merupakan singkatan dari: Amanah, Manfaat, Berkarya, Yakin, Asri, Aman, dan Rukun.',
      visi:
        'Menjadi kampung yang berdaya dan mandiri dengan pemimpin yang Amanah agar dapat berManfaat, terus Berkarya dengan keYakinan, sehingga RW 01 menjadi Asri, Aman, Rukun, dan Gotong Royong.',
      misi:
        '1. Menjaga kepemimpinan yang Amanah dan berManfaat.\n2. Mendorong warga untuk terus Berkarya.\n3. Mewujudkan lingkungan RW 01 yang Asri, Aman, dan Rukun melalui semangat Gotong Royong.',
      alamat: 'Balai RW 01, Jl. Ikan Piranha Atas, Kel. Tunjungsekar, Kec. Lowokwaru, Kota Malang',
      kontakTelp: '081234567890',
      kontakEmail: 'rw01tunjungsekar@gmail.com',
    },
  });
  console.log('✓ Profile RW 01 seeded');

  // 3. ORGANIZATION MEMBERS (18 Pengurus SK Lurah Tunjungsekar)
  const members = [
    { name: 'Sugiono', position: 'Ketua RW', orderIndex: 1 },
    { name: 'Moch. Jaenuri', position: 'Penasehat', orderIndex: 2 },
    { name: 'Achmad Kasim', position: 'Penasehat', orderIndex: 3 },
    { name: 'Hendro Haryoko', position: 'Sekretaris', orderIndex: 4 },
    { name: 'Didik Sunardi', position: 'Bendahara', orderIndex: 5 },
    { name: 'Agus Santoso', position: 'Sie Kamtibmas', orderIndex: 6 },
    { name: 'Arifin', position: 'Sie Keagamaan', orderIndex: 7 },
    { name: 'Agustina Tandiallo', position: 'Sie Keagamaan', orderIndex: 8 },
    { name: 'Bayu Wiranata', position: 'Sie Kepemudaan', orderIndex: 9 },
    { name: 'Hendra Prasetya', position: 'Sie KLH', orderIndex: 10 },
    { name: 'Eko Sujiono', position: 'Sie KLH', orderIndex: 11 },
    { name: 'Kaselan', position: 'Sie Sosial Kematian', orderIndex: 12 },
    { name: 'Widodo Ma\'ruf', position: 'Sie Sosial Kematian', orderIndex: 13 },
    { name: 'Djuni Triyono', position: 'Sie Perlengkapan', orderIndex: 14 },
    { name: 'Djono', position: 'Sie Pembangunan', orderIndex: 15 },
    { name: 'Hariyanto', position: 'Sie Pembangunan', orderIndex: 16 },
    { name: 'Kusdianto', position: 'Sie Humas', orderIndex: 17 },
    { name: 'Rudi Hartono', position: 'Sie Humas', orderIndex: 18 },
  ];

  await prisma.organizationMember.deleteMany();
  await prisma.organizationMember.createMany({ data: members });
  console.log(`✓ ${members.length} organization members seeded (batch insert)`);

  // 4. ANNOUNCEMENTS & BERITA (Dokumen Asli Kampung Mbois)
  const announcements = [
    {
      title: 'Kampung Sensasi Wujudkan Bebas BABS',
      slug: 'kampung-sensasi-wujudkan-bebas-babs',
      content:
        'Program percepatan pembuatan septic tank swadaya bagi warga di Kampung Sensasi (RT 04) didampingi oleh USAID IUWASH Plus dan Pemkot Malang.',
      category: 'berita' as const,
      thumbnailUrl: 'https://mvntxmxwjnpmhedginvg.supabase.co/storage/v1/object/public/gallery/stbm-award.png',
      publishedAt: new Date('2021-04-26T07:00:00Z'),
      createdBy: admin.id,
    },
    {
      title: 'Parade Cuci Tangan ala Warga Malang, Siapkan 100 Tong Air di Kampung',
      slug: 'parade-cuci-tangan-100-tong-air',
      content:
        'Gerakan parade cuci tangan dan penyediaan 100 tong air cuci tangan di area RW 01 untuk pencegahan Covid-19 dan penerapan gaya hidup sehat.',
      category: 'berita' as const,
      thumbnailUrl: 'https://mvntxmxwjnpmhedginvg.supabase.co/storage/v1/object/public/gallery/juara-kampung-bersinar.png',
      publishedAt: new Date('2020-10-15T08:00:00Z'),
      createdBy: admin.id,
    },
    {
      title: 'Taman Momong Ramah Anak: Wadah Pengasuhan Bersama',
      slug: 'taman-momong-ramah-anak',
      content:
        'Peresmian dan pengembangan Taman Momong hasil kolaborasi RW 01 dengan PSGA UIN Malang sebagai wadah literasi, parenting, dan stimulasi tumbuh kembang anak.',
      category: 'berita' as const,
      thumbnailUrl: 'https://mvntxmxwjnpmhedginvg.supabase.co/storage/v1/object/public/gallery/taman-momong.png',
      publishedAt: new Date('2021-12-01T06:00:00Z'),
      createdBy: admin.id,
    },
    {
      title: 'Jadwal Kerja Bakti Massal Menyambut HUT RI',
      slug: 'jadwal-kerja-bakti-massal-hut-ri',
      content:
        'Pengumuman pelaksanaan kerja bakti rutin pembersihan saluran air (Resik Kali) dan lingkungan RT 01-11 setiap 3 bulan sekali serta menjelang peringatan HUT RI.',
      category: 'pengumuman' as const,
      thumbnailUrl: 'https://mvntxmxwjnpmhedginvg.supabase.co/storage/v1/object/public/gallery/urban-farming.png',
      publishedAt: new Date('2026-08-01T08:00:00Z'),
      createdBy: admin.id,
    },
  ];

  await prisma.announcement.deleteMany();
  await prisma.announcement.createMany({ data: announcements });
  console.log(`✓ ${announcements.length} announcements seeded (batch insert)`);

  // 5. EVENTS (AGENDA KEGIATAN)
  const events = [
    {
      title: 'Posyandu Balita & Lansia Melati RW 01',
      description:
        'Pemeriksaan kesehatan rutin balita, penimbangan, imunisasi, dan penyuluhan gizi bagi ibu dan lansia.',
      location: 'Posyandu Melati / Balai RW 01',
      startDate: new Date('2026-08-15T08:00:00Z'),
      endDate: new Date('2026-08-15T11:00:00Z'),
      status: 'upcoming' as const,
      createdBy: admin.id,
    },
    {
      title: 'Senam Sehat Rutin Klub Jantung Sehat (KJS)',
      description:
        'Kegiatan senam bersama warga dan senam keliling antar-RT untuk meningkatkan kebugaran jasmani.',
      location: 'Jalan Utama / Area RT RW 01',
      startDate: new Date('2026-08-10T06:00:00Z'),
      endDate: new Date('2026-08-10T07:30:00Z'),
      status: 'upcoming' as const,
      createdBy: admin.id,
    },
    {
      title: 'Program Kerja Bakti "Resik Kali"',
      description:
        'Kerja bakti membersihkan aliran sungai/selokan untuk mencegah banjir dan menjaga kebersihan.',
      location: 'Saluran Air / Sungai RW 01',
      startDate: new Date('2026-07-20T06:00:00Z'),
      endDate: new Date('2026-07-20T09:00:00Z'),
      status: 'done' as const,
      createdBy: admin.id,
    },
    {
      title: 'Kirab Budaya & Tasyakuran HUT RI',
      description:
        'Pawai kirab budaya warga RW 01 dan bazar UMKM rutin dalam memperingati Hari Kemerdekaan RI.',
      location: 'Area Wilayah RW 01',
      startDate: new Date('2026-08-17T07:00:00Z'),
      endDate: new Date('2026-08-17T12:00:00Z'),
      status: 'upcoming' as const,
      createdBy: admin.id,
    },
  ];

  await prisma.event.deleteMany();
  const createdEvents = await prisma.event.createManyAndReturn({ data: events });
  console.log(`✓ ${createdEvents.length} events seeded (batch insert)`);

  // 6. GALLERY (7 FOTO SUPABASE STORAGE ASLI)
  const [, senam, resikKali] = createdEvents;

  const gallery = [
    {
      eventId: null,
      imageUrl: 'https://mvntxmxwjnpmhedginvg.supabase.co/storage/v1/object/public/gallery/stbm-award.png',
      caption: 'Penerimaan Penghargaan STBM Award 2020 dari Menteri Kesehatan RI.',
    },
    {
      eventId: null,
      imageUrl: 'https://mvntxmxwjnpmhedginvg.supabase.co/storage/v1/object/public/gallery/juara-kampung-bersinar.png',
      caption: 'Penyerahan Hadiah Juara 3 Lomba Kampung Bersinar se-Kota Malang 2021.',
    },
    {
      eventId: null,
      imageUrl: 'https://mvntxmxwjnpmhedginvg.supabase.co/storage/v1/object/public/gallery/taman-momong.png',
      caption: 'Suasana belajar dan bermain anak-anak di fasilitas Taman Momong Ramah Anak.',
    },
    {
      eventId: null,
      imageUrl: 'https://mvntxmxwjnpmhedginvg.supabase.co/storage/v1/object/public/gallery/urban-farming.png',
      caption: 'Kegiatan panen sayur dan perawatan tanaman pada area Urban Farming RW 01.',
    },
    {
      eventId: senam.id,
      imageUrl: 'https://mvntxmxwjnpmhedginvg.supabase.co/storage/v1/object/public/gallery/senam-kjs.png',
      caption: 'Pelaksanaan senam bersama warga oleh Klub Jantung Sehat (KJS) RW 01.',
    },
    {
      eventId: senam.id,
      imageUrl: 'https://mvntxmxwjnpmhedginvg.supabase.co/storage/v1/object/public/gallery/senam-kjs2.png',
      caption: 'Semangat ibu-ibu warga RW 01 mengikuti kegiatan senam keliling antar-RT.',
    },
    {
      eventId: resikKali.id,
      imageUrl: 'https://mvntxmxwjnpmhedginvg.supabase.co/storage/v1/object/public/gallery/bank-sampah.png',
      caption: 'Pengumpulan dan penimbangan sampah kering di Bank Sampah Sekar Melati.',
    },
  ];

  await prisma.gallery.deleteMany();
  await prisma.gallery.createMany({ data: gallery });
  console.log(`✓ ${gallery.length} gallery items seeded with real Supabase URLs (batch insert)`);

  // 7. DATA 11 RT & BRANDING TEMATIK (RESMI KAMPUNG MBOIS)
  const rts = [
    {
      number: 1,
      leaderName: 'Wahyudiono',
      description: 'Kampung Erte Utas',
      achievements: 'Aktif dalam program Proklik & Inovasi Lingkungan',
      isFeatured: true,
    },
    {
      number: 2,
      leaderName: 'Arif Rahman',
      description: 'Area Pemukiman Warga RW 01',
      achievements: 'Partisipasi aktif kegiatan kemasyarakatan',
      isFeatured: false,
    },
    {
      number: 3,
      leaderName: 'Panjianto',
      description: 'Area Pemukiman Warga RW 01',
      achievements: 'Pengelolaan TPQ & Kegiatan Keagamaan',
      isFeatured: false,
    },
    {
      number: 4,
      leaderName: 'Yoga Wibowo',
      description: 'Kampung Sensasi (Kampung Sehat, Aman, & Bebas BABS)',
      achievements: 'Sukses program Bebas BABS & Septic Tank Swadaya',
      isFeatured: true,
    },
    {
      number: 5,
      leaderName: 'Setiawan Tuhu B',
      description: 'Green Alay (Taman & Penghijauan Lingkungan RT 05)',
      achievements: 'Penataan Ruang Hijau Terbuka',
      isFeatured: true,
    },
    {
      number: 6,
      leaderName: 'M. Husni Fadli',
      description: 'Kampung Pelita (Peduli Lingkungan Tiada Akhir) & Taman Lodan Heritage',
      achievements: 'Fasilitas Taman Baca / Rumah Baca Anak',
      isFeatured: true,
    },
    {
      number: 7,
      leaderName: 'Surya D',
      description: 'Kampung Anggur',
      achievements: 'Pusat Budidaya Tanaman Anggur & Taman Baca',
      isFeatured: true,
    },
    {
      number: 8,
      leaderName: 'Samsu Andi H',
      description: 'Kampung Urban Farming & Taman Lodan Heritage',
      achievements: 'Pemanfaatan Lahan Urban Farming & TOGA',
      isFeatured: true,
    },
    {
      number: 9,
      leaderName: 'Boedi Y',
      description: 'Taman RT 09',
      achievements: 'Penataan Taman Asri Lingkungan',
      isFeatured: false,
    },
    {
      number: 10,
      leaderName: 'Gatot Nugroho',
      description: 'Kampung Telang dan Madu',
      achievements: 'Budidaya Bunga Telang & Lebah Madu',
      isFeatured: true,
    },
    {
      number: 11,
      leaderName: 'Ken RM Adimas',
      description: 'Area Pemukiman & Kegiatan Pemuda',
      achievements: 'Aktif dalam kegiatan Karang Taruna & Olahraga',
      isFeatured: false,
    },
  ];

  await prisma.rt.deleteMany();
  await prisma.rt.createMany({ data: rts });
  console.log(`✓ ${rts.length} data RT resmi seeded (batch insert)`);

  console.log('\n✅ Seed data resmi Kampung Mbois RW 01 dengan Supabase Storage URLs selesai!');
  console.log('Login admin: username=admin, password=admin123');
}

main()
  .catch((e) => {
    console.error('Seed gagal:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
