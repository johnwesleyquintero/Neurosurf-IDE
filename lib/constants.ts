"use client"

export const initialCode = `import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  const { data: gpuStats } = useQuery({
    queryKey: ["gpu-stats"],
    queryFn: () => fetch("/api/gpu-stats"),
    refetchInterval: 1000,
  });
  
  return (
    <motion.div className="dashboard">
      {/* Dashboard content */}
    </motion.div>
  );
};

export default Dashboard;
`

