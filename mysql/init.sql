-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql-container:3306
-- Generation Time: Aug 28, 2023 at 09:45 PM
-- Server version: 8.0.33
-- PHP Version: 8.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `app`
--

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int NOT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `organization` varchar(45) DEFAULT NULL,
  `facility` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `first_name`, `last_name`, `email`, `organization`, `facility`) VALUES
(1, 'Person', '1', 'person1@null.null', 'organization1', 'facility1'),
(2, 'Person', '2', 'person2@null.null', 'organization2', 'facility2'),
(3, 'Person', '3', 'person3@null.null', 'organization3', 'facility3');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `event_id` bigint NOT NULL,
  `user_id` varchar(45) DEFAULT NULL,
  `date` varchar(45) DEFAULT NULL,
  `facility` varchar(45) DEFAULT NULL,
  `equipment` varchar(64) DEFAULT NULL,
  `form1` text,
  `form2` text,
  `start_datetime` varchar(45) DEFAULT NULL,
  `end_datetime` varchar(45) DEFAULT NULL,
  `approval_status` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`event_id`, `user_id`, `date`, `facility`, `equipment`, `form1`, `form2`, `start_datetime`, `end_datetime`, `approval_status`) VALUES
(1691039091991, 'user', '2023-08-10', 'organization1', 'equipment1', 'test', 'event', '2023-08-10T08:00:00.000Z', '2023-08-18T13:00:00.000Z', 'approved');

-- --------------------------------------------------------

--
-- Table structure for table `facilities`
--

CREATE TABLE `facilities` (
  `id` int NOT NULL,
  `location` varchar(64) DEFAULT NULL,
  `equipment` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `facilities`
--

INSERT INTO `facilities` (`id`, `location`, `equipment`) VALUES
(1, 'organization1', 'equipment1'),
(2, 'organization1', 'equipment2'),
(3, 'organization1', 'equipment3'),
(4, 'organization2', 'equipment1'),
(5, 'organization2', 'equipment2'),
(6, 'organization2', 'equipment3'),
(7, 'organization3', 'equipment1'),
(8, 'organization3', 'equipment2'),
(9, 'organization3', 'equipment3'),
(10, 'organization4', 'equipment1'),
(11, 'organization4', 'equipment2'),
(12, 'organization4', 'equipment3'),
(13, 'organization4', 'equipment4'),
(14, 'organization4', 'equipment5'),
(15, 'organization4', 'equipment6');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `email` varchar(64) NOT NULL,
  `role` varchar(45) DEFAULT NULL,
  `password` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`email`, `role`, `password`) VALUES
('admin', 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'),
('read', 'read-only', '3316348dbadfb7b11c7c2ea235949419e23f9fa898ad2c198f999617912a9925'),
('user', 'user', '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`);

--
-- Indexes for table `facilities`
--
ALTER TABLE `facilities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `facilities`
--
ALTER TABLE `facilities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
