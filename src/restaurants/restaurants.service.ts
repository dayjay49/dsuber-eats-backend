import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      // assign current user to be the owner of the restaurant
      newRestaurant.owner = owner;
      // trim() removes whitespaces from both ends of the string
      const categoryName = createRestaurantInput.categoryName
        .trim()
        .toLowerCase()
        .replace(/ +g/, '');   // -> this one is to remove any multiple whitespaces in the middle
      // using regex to replace all the spaces of the given string
      const categorySlug = categoryName.replace(/ /g, '-');

      let category = await this.categories.findOne({ slug: categorySlug });
      if (!category) {
        category = await this.categories.save(
          this.categories.create({ slug: categorySlug, name: categoryName }))
      }
      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: 'Could not create restaurant' };
    }
  }
}