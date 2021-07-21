import { Injectable } from "@nestjs/common";
import { Cron, Interval, SchedulerRegistry, Timeout } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { User } from "src/users/entities/user.entity";
import { LessThan, Repository } from "typeorm";
import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from "./dtos/create-payment.dto";
import { GetPaymentsOutput } from "./dtos/get-payments.dto";
import { Payment } from "./entities/payment.entity";


@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly payments: Repository<Payment>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  async createPayment(
    owner: User,
    { transactionId, restaurantId }: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurant) {
        return { ok: false, error: 'Restaurant not found' };
      }
      if (restaurant.ownerId !== owner.id) {
        return { ok: false, error: 'You are not allowed to do this' };
      }
      restaurant.isPromoted = true;
      const date = new Date();
      // promotion for 7 days from payment date
      date.setDate(date.getDate() + 7);
      restaurant.promotedUntil = date;
      this.restaurants.save(restaurant);
      
      await this.payments.save(
        this.payments.create({
          transactionId,
          user: owner,
          restaurant,
        }),
      );
      return { ok: true };
    } catch (err) {
      return { ok: false, error: 'Could not create payment' };
    }
  }

  async getPayments(user: User): Promise<GetPaymentsOutput> {
    try {
      const payments = await this.payments.find({ user });
      return { ok: true, payments };
    } catch (err) {
      return { ok: false, error: 'Could not get payments' };
    }
  }

  @Interval(2000)
  async checkPromotedRestaurants() {
    const restaurants = await this.restaurants.find({
      isPromoted: true,
      promotedUntil: LessThan(new Date()),
    });
    // console.log(restaurants);
    restaurants.forEach(async (restaurant) => {
      restaurant.isPromoted = false;
      restaurant.promotedUntil = null;
      await this.restaurants.save(restaurant);
    });
  }
}