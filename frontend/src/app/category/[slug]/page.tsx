"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import CategoryShowcase from '@/components/category/CategoryShowcase';

export default function CategoryPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'gold';

  return <CategoryShowcase categorySlug={slug} />;
}
