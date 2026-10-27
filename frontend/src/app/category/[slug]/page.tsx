"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CategoryShowcase from '@/components/category/CategoryShowcase';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || 'gold';

  useEffect(() => {
    if (slug === 'astrological-stones') {
      router.replace('/collections');
    }
  }, [slug, router]);

  if (slug === 'astrological-stones') {
    return null;
  }

  return <CategoryShowcase categorySlug={slug} />;
}
