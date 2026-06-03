"use client";

import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionText: string;
  actionHref: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, actionText, actionHref }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-24 h-24 bg-ivory rounded-full flex items-center justify-center mb-8 text-primary/30">
        {icon}
      </div>
      <h2 className="text-3xl font-serif font-bold text-primary italic mb-4">{title}</h2>
      <p className="text-muted-foreground max-w-md mb-10 text-sm leading-relaxed">
        {description}
      </p>
      <Link 
        href={actionHref}
        className="bg-primary text-white px-10 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-secondary transition-all shadow-xl"
      >
        {actionText}
      </Link>
    </div>
  );
};

export default EmptyState;
