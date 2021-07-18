import { EntityRepository, Repository } from "typeorm";
import { Category } from "../entities/category.entity";

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {

  async getOrCreate(name: string): Promise<Category> {
    // the replace method below removes any multiple whitespaces in the middle
    const categoryName = name.trim().toLowerCase().replace(/ +g/, '');
    // using regex to replace all the spaces of the given string
    const categorySlug = categoryName.replace(/ /g, '-');

    let category = await this.findOne({ slug: categorySlug });
    if (!category) {
      category = await this.save(
        this.create({ slug: categorySlug, name: categoryName }),
      );
    }
    return category;
  }
}