-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 03 Apr 2020 pada 16.11
-- Versi server: 10.1.35-MariaDB
-- Versi PHP: 7.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `node_sewa_alat_penyemprot`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(500) NOT NULL,
  `password` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`) VALUES
(1, 'habib', '123');

-- --------------------------------------------------------

--
-- Struktur dari tabel `alat_semprot`
--

CREATE TABLE `alat_semprot` (
  `id` int(11) NOT NULL,
  `ukuran` varchar(7) NOT NULL,
  `stok` int(11) NOT NULL,
  `harga_sewa` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `alat_semprot`
--

INSERT INTO `alat_semprot` (`id`, `ukuran`, `stok`, `harga_sewa`) VALUES
(1, 'kecil', 78, 20000),
(2, 'besar', 100, 50000),
(3, 'sedang', 98, 30000),
(4, 'sedangM', 100, 30000),
(5, 'besarC', 100, 50000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pelanggan`
--

CREATE TABLE `pelanggan` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `no_telepon` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `pelanggan`
--

INSERT INTO `pelanggan` (`id`, `nama`, `email`, `password`, `no_telepon`) VALUES
(1, 'habib', 'azizul@gmail.com', '321', '123'),
(2, 'haq', 'haq@gmail.com', '$2b$10$VBUUc88ZHVE.vH9OOQsAC.gs4.J8F/6DCYNkvdJMO0I7olLtN/5ga', '0987654321'),
(4, 'habib', 'habib@gmail.com', '$2b$10$B2YmG5GUDMJudZCMFjAJeuGCoWhymGOZzaZltAyq3/b2v5ejXJHP6', '0987654321');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaksi_alat_semprot`
--

CREATE TABLE `transaksi_alat_semprot` (
  `id` int(11) NOT NULL,
  `id_pelanggan` int(11) NOT NULL,
  `id_alat_semprot` int(11) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `harga_sewa` double NOT NULL,
  `total_harga` double NOT NULL,
  `status` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `transaksi_alat_semprot`
--

INSERT INTO `transaksi_alat_semprot` (`id`, `id_pelanggan`, `id_alat_semprot`, `jumlah`, `harga_sewa`, `total_harga`, `status`) VALUES
(2, 1, 1, 5, 20000, 100000, 'disewa'),
(3, 1, 1, 5, 20000, 100000, 'disewa'),
(4, 1, 1, 7, 20000, 140000, 'disewa');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `alat_semprot`
--
ALTER TABLE `alat_semprot`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `pelanggan`
--
ALTER TABLE `pelanggan`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `transaksi_alat_semprot`
--
ALTER TABLE `transaksi_alat_semprot`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `alat_semprot`
--
ALTER TABLE `alat_semprot`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `pelanggan`
--
ALTER TABLE `pelanggan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `transaksi_alat_semprot`
--
ALTER TABLE `transaksi_alat_semprot`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
