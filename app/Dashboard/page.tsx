"use client";
import { useState } from 'react'
import Dashboard from '../components/Dashboard'

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dashboard />
  );
}