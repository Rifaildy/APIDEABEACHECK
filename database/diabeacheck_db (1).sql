-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 11, 2025 at 12:19 PM
-- Server version: 8.0.30
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `diabeacheck_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `prediction_history`
--

CREATE TABLE `prediction_history` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `age` int NOT NULL,
  `glucose` decimal(6,2) NOT NULL,
  `blood_pressure` decimal(6,2) NOT NULL,
  `skin_thickness` decimal(6,2) DEFAULT NULL,
  `insulin` decimal(8,2) DEFAULT NULL,
  `bmi` decimal(5,2) NOT NULL,
  `diabetes_pedigree_function` decimal(8,6) DEFAULT NULL,
  `pregnancies` int DEFAULT '0',
  `prediction_result` tinyint NOT NULL,
  `probability` decimal(5,4) NOT NULL,
  `confidence` decimal(5,4) NOT NULL,
  `risk_level` enum('Low','Moderate','High') NOT NULL,
  `model_version` varchar(50) DEFAULT 'MLP Neural Network',
  `model_accuracy` decimal(5,4) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `device_info` json DEFAULT NULL,
  `location_data` json DEFAULT NULL,
  `predicted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `prediction_history`
--

INSERT INTO `prediction_history` (`id`, `user_id`, `session_id`, `age`, `glucose`, `blood_pressure`, `skin_thickness`, `insulin`, `bmi`, `diabetes_pedigree_function`, `pregnancies`, `prediction_result`, `probability`, `confidence`, `risk_level`, `model_version`, `model_accuracy`, `ip_address`, `user_agent`, `device_info`, `location_data`, `predicted_at`, `created_at`, `updated_at`) VALUES
(1, NULL, 'session_1749592984807', 21, '122.00', '122.00', NULL, '45.00', '21.00', NULL, 0, 0, '0.0138', '0.9862', 'Low', 'MLP Neural Network', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '{\"mobile\": \"?0\", \"platform\": \"\\\"Windows\\\"\"}', NULL, '2025-06-10 22:03:05', '2025-06-10 22:03:05', '2025-06-10 22:03:04'),
(2, 3, 'session_1749593987863', 21, '111.00', '111.00', NULL, '45.00', '21.00', NULL, 0, 0, '0.0080', '0.9920', 'Low', 'MLP Neural Network', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '{\"mobile\": \"?0\", \"platform\": \"\\\"Windows\\\"\"}', NULL, '2025-06-10 22:19:48', '2025-06-10 22:19:48', '2025-06-10 22:19:47'),
(3, 3, 'session_1749594040392', 45, '160.00', '150.00', NULL, '50.00', '34.00', NULL, 0, 1, '0.6592', '0.6592', 'High', 'MLP Neural Network', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '{\"mobile\": \"?0\", \"platform\": \"\\\"Windows\\\"\"}', NULL, '2025-06-10 22:20:40', '2025-06-10 22:20:40', '2025-06-10 22:20:40'),
(4, 3, 'session_1749594125740', 23, '123.00', '123.00', '2.00', '56.00', '56.00', '2.000000', 0, 1, '0.8050', '0.8050', 'High', 'MLP Neural Network', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '{\"mobile\": \"?0\", \"platform\": \"\\\"Windows\\\"\"}', NULL, '2025-06-10 22:22:06', '2025-06-10 22:22:06', '2025-06-10 22:22:05'),
(5, 3, 'session_1749594410979', 21, '122.00', '122.00', '2.00', '45.00', '45.00', '2.000000', 0, 1, '0.5943', '0.5943', 'High', 'MLP Neural Network', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '{\"mobile\": \"?0\", \"platform\": \"\\\"Windows\\\"\"}', NULL, '2025-06-10 22:26:51', '2025-06-10 22:26:51', '2025-06-10 22:26:51'),
(6, 3, 'session_1749597455474', 35, '90.00', '120.00', NULL, '25.00', '22.50', NULL, 0, 0, '0.0044', '0.9956', 'Low', 'MLP Neural Network', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '{\"mobile\": \"?0\", \"platform\": \"\\\"Windows\\\"\"}', NULL, '2025-06-10 23:17:35', '2025-06-10 23:17:35', '2025-06-10 23:17:35'),
(7, 3, 'session_1749602001974', 90, '200.00', '90.00', NULL, '50.00', '28.80', NULL, 0, 1, '0.9977', '0.9977', 'High', 'MLP Neural Network', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '{\"mobile\": \"?0\", \"platform\": \"\\\"Windows\\\"\"}', NULL, '2025-06-11 00:33:22', '2025-06-11 00:33:22', '2025-06-11 00:33:21'),
(8, 2, 'session_1749602137089', 35, '88.00', '120.00', NULL, '25.00', '22.50', NULL, 0, 0, '0.0039', '0.9961', 'Low', 'MLP Neural Network', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '{\"mobile\": \"?0\", \"platform\": \"\\\"Windows\\\"\"}', NULL, '2025-06-11 00:35:37', '2025-06-11 00:35:37', '2025-06-11 00:35:37'),
(9, 2, 'session_1749607149388', 45, '150.00', '130.00', NULL, '18.00', '28.00', NULL, 0, 0, '0.4431', '0.5569', 'Low', 'MLP Neural Network', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '{\"mobile\": \"?0\", \"platform\": \"\\\"Windows\\\"\"}', NULL, '2025-06-11 01:59:09', '2025-06-11 01:59:09', '2025-06-11 01:59:09'),
(10, 2, 'session_1749632553352', 44, '150.00', '130.00', NULL, '17.00', '28.00', NULL, 0, 0, '0.4295', '0.5705', 'Low', 'MLP Neural Network', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '{\"mobile\": \"?0\", \"platform\": \"\\\"Windows\\\"\"}', NULL, '2025-06-11 09:02:33', '2025-06-11 09:02:33', '2025-06-11 09:02:33'),
(11, 2, 'session_1749632631314', 45, '180.00', '150.00', NULL, '23.00', '32.00', NULL, 0, 1, '0.7973', '0.7973', 'High', 'MLP Neural Network', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '{\"mobile\": \"?0\", \"platform\": \"\\\"Windows\\\"\"}', NULL, '2025-06-11 09:03:51', '2025-06-11 09:03:51', '2025-06-11 09:03:51'),
(12, 2, 'session_1749640583382', 55, '180.00', '150.00', NULL, '23.00', '32.00', NULL, 0, 1, '0.8593', '0.8593', 'High', 'MLP Neural Network', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '{\"mobile\": \"?0\", \"platform\": \"\\\"Windows\\\"\"}', NULL, '2025-06-11 11:16:23', '2025-06-11 11:16:23', '2025-06-11 11:16:23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `profile_picture` varchar(500) DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT '0',
  `email_verification_token` varchar(255) DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `password_reset_expires` datetime DEFAULT NULL,
  `login_attempts` int DEFAULT '0',
  `locked_until` datetime DEFAULT NULL,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`, `phone`, `date_of_birth`, `gender`, `profile_picture`, `email_verified`, `email_verification_token`, `password_reset_token`, `password_reset_expires`, `login_attempts`, `locked_until`, `status`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'test@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Test', 'User', '08123456789', NULL, 'male', NULL, 1, NULL, NULL, NULL, 0, NULL, 'active', NULL, '2025-06-09 05:11:50', '2025-06-09 05:11:50'),
(2, 'nasrun671@gmail.com', '$2a$12$hH2emyWqH5ERoYVQQw039uBUhxbQmJrSRPZszBz.GiaXPhKqPyKKe', 'Nasrun', 'H', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, NULL, 'active', '2025-06-11 17:40:34', '2025-06-09 07:24:22', '2025-06-11 10:40:33'),
(3, 'rifa@gmail.com', '$2a$12$lu.8f0.YSgVcWxMb6EYeyOXslhrQMRazHGytDKHNS6wkpTRdcP9Ku', 'Rifaaa', 'N.A.', '0895386784050', '2000-01-01', 'male', NULL, 0, NULL, NULL, NULL, 0, NULL, 'active', '2025-06-11 05:19:33', '2025-06-10 21:25:41', '2025-06-10 22:19:33');

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `blood_type` varchar(5) DEFAULT NULL,
  `medical_conditions` json DEFAULT NULL,
  `medications` json DEFAULT NULL,
  `allergies` json DEFAULT NULL,
  `emergency_contact_name` varchar(100) DEFAULT NULL,
  `emergency_contact_phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`id`, `user_id`, `height`, `weight`, `blood_type`, `medical_conditions`, `medications`, `allergies`, `emergency_contact_name`, `emergency_contact_phone`, `created_at`, `updated_at`) VALUES
(1, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-09 07:24:22', '2025-06-09 07:24:22'),
(2, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 21:25:41', '2025-06-10 21:25:41');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `session_token` text NOT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `device_info` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `is_active` tinyint(1) DEFAULT '1',
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_sessions`
--

INSERT INTO `user_sessions` (`id`, `user_id`, `session_token`, `refresh_token`, `device_info`, `ip_address`, `user_agent`, `is_active`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0OTQ1Mzg2MywiZXhwIjoxNzQ5NTQwMjYzfQ.xjMBdqJY2uMJUWg9YVqdjs0Oo8qI-dMJOijxoOIB-5o', '204530070804f5fc41ac7a71c5a6ee887705cf57df4d0122b0e195e99ce29145', '{\"ip\": \"::1\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 1, '2025-06-10 14:24:23', '2025-06-09 07:24:23', '2025-06-09 07:24:23'),
(2, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0OTU2MjQxMCwiZXhwIjoxNzQ5NjQ4ODEwfQ.rW75PVN4uEuhVPXUExLThblyQdlISfXL4ymFsT2Z-Po', 'f37fe633b5fd2d5f8f03cc81dd4106bd2c9b011c341207cf64401501caa7eda3', '{\"ip\": \"::1\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 1, '2025-06-11 20:33:31', '2025-06-10 13:33:30', '2025-06-10 13:33:30'),
(3, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0OTU5MDE1MSwiZXhwIjoxNzUwMTk0OTUxfQ.Lb_IVnvUVBxqsoxOlt3CUY8LR694qVjASwVhiPvKds0', '7da858cd8a8719ce8856c6ca89b1c5223ec000b79af8ad08c5501c9e1d0e3195', '{\"ip\": \"::1\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 1, '2025-06-12 04:15:52', '2025-06-10 21:15:51', '2025-06-10 21:15:51'),
(4, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0OTU5MDU2MiwiZXhwIjoxNzUwMTk1MzYyfQ.a6u8w9xSGsVk_6MYz6SgAquGJ4rU1WpgY4cekk1oXyU', '8c37de6d7e67bf3e65ebe85a58ac3a300bb6162ee0262719a885dcb54732ce42', '{\"ip\": \"::1\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 1, '2025-06-12 04:22:43', '2025-06-10 21:22:42', '2025-06-10 21:22:42'),
(5, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTU5MDc0MSwiZXhwIjoxNzUwMTk1NTQxfQ.C7YOAOOILD7GoykFy7hnA_2OlmpcDiSusz7L15qP9-8', 'ca20064ba78b4d2b7592ed2b569fd8f31f7ff53f76c6b3f137ab24fd49460ac6', '{\"ip\": \"::1\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 1, '2025-06-12 04:25:41', '2025-06-10 21:25:41', '2025-06-10 21:25:41'),
(6, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTU5MDc4OSwiZXhwIjoxNzUwMTk1NTg5fQ.oo0et6N8tp1OrRCmJpbtpdKjnbDHOoOVg9F8cnmLH1E', 'ebe905e72285e47e5079e437b8ada2a163a6f3d54e8a42d17f65ea5dca59e71b', '{\"ip\": \"::1\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 1, '2025-06-12 04:26:29', '2025-06-10 21:26:29', '2025-06-10 21:26:29'),
(7, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTU5Mzk3MywiZXhwIjoxNzUwMTk4NzczfQ.pvNT72sh68WIsQphTS2rj6Ms1Qk8e-lHLoyiC7LRHp8', 'c28be9bc04cc4dca187cf11abaefdb82725906d8718690b25de0ec0c2709f80c', '{\"ip\": \"::1\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 1, '2025-06-12 05:19:33', '2025-06-10 22:19:33', '2025-06-10 22:19:33'),
(8, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0OTYwMjA2OCwiZXhwIjoxNzUwMjA2ODY4fQ.pi_FC42Sm1vpLOZlBNhav67cEHOGk-xetHYJoftRBXw', 'ed4541302a10906c628977c3eb9b736a2b3bcc6936b69fd31812908c94d111a5', '{\"ip\": \"::1\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 1, '2025-06-12 07:34:28', '2025-06-11 00:34:28', '2025-06-11 00:34:28'),
(9, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0OTYwMzMzOCwiZXhwIjoxNzUwMjA4MTM4fQ.cRjcpNy-6dbo5HV30cLKmz3sJ2QptUiqg4J5Tdc7rNg', '64736eba85a0ec5c5e5bf44e7e992fe42b8f1647aa8bbd3b26cefe20e58e181c', '{\"ip\": \"::1\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 1, '2025-06-12 07:55:38', '2025-06-11 00:55:38', '2025-06-11 00:55:38'),
(10, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0OTYzMjEzNCwiZXhwIjoxNzUwMjM2OTM0fQ.NuzpTX7CV-9hp58IaHDfNyn49H7XXPgRtwsX6lV-yXE', '3e04ab09d5ea05db8b69b0a72dd4190cc18ebc8d2d3d21f92118b50b954f3216', '{\"ip\": \"::1\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 1, '2025-06-12 15:55:35', '2025-06-11 08:55:34', '2025-06-11 08:55:34'),
(11, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0OTYzMjQ0OCwiZXhwIjoxNzUwMjM3MjQ4fQ.N0K7kdYOANNQ0foInb86GaG51e5TCOF90GYsiBbLsq0', 'b40c3ecbf043c78e731e86faf87dab2bbe3487c6551549af12c7f340806d8541', '{\"ip\": \"::1\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 1, '2025-06-12 16:00:48', '2025-06-11 09:00:48', '2025-06-11 09:00:48'),
(12, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0OTYzODQzNCwiZXhwIjoxNzUwMjQzMjM0fQ.FWXsZwx8vbhIloEWDlVq39F8SpWUElGnqd_ZmvsirBI', '0bd1809e4b7e775698b09efedb1f33f48891be20b62064e648d29cf74bff903d', '{\"ip\": \"::1\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 1, '2025-06-12 17:40:34', '2025-06-11 10:40:34', '2025-06-11 10:40:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `prediction_history`
--
ALTER TABLE `prediction_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_session_id` (`session_id`),
  ADD KEY `idx_predicted_at` (`predicted_at`),
  ADD KEY `idx_risk_level` (`risk_level`),
  ADD KEY `idx_prediction_result` (`prediction_result`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_status` (`status`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_sessions_user_id` (`user_id`),
  ADD KEY `idx_user_sessions_token` (`session_token`(255)),
  ADD KEY `idx_user_sessions_active` (`is_active`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `prediction_history`
--
ALTER TABLE `prediction_history`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `prediction_history`
--
ALTER TABLE `prediction_history`
  ADD CONSTRAINT `prediction_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
