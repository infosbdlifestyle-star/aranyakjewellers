import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async getHierarchy() {
    const all = await this.findAll();
    const parentCategories = all.filter(c => !c.parentId);
    
    return parentCategories.map(parent => ({
      ...parent,
      subcategories: all.filter(c => c.parentId === parent.id)
    }));
  }

  async findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.category.findUnique({
      where: { slug },
    });
  }

  async create(data: any) {
    return this.prisma.category.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
