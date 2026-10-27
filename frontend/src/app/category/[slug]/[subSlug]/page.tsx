"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import CategoryShowcase from '@/components/category/CategoryShowcase';

export default function SubCategoryPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'gold';
  const subSlug = (params?.subSlug as string) || 'all';

  return (
    <CategoryShowcase 
      categorySlug={slug} 
      initialSubCategorySlug={subSlug} 
    />
  );
}
