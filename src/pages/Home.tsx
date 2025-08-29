import React from 'react';
import { Hero } from '../components/Home/Hero';
import { Features } from '../components/Home/Features';
import { HowItWorks } from '../components/Home/HowItWorks';

export function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
    </div>
  );
}