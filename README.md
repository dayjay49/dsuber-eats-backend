# DSuber Eats

The Backend of DSuber Eats Clone

## Orders CRUD:

- Create Order
- Get Order/Orders
- Edit Order

- Orders Subscription:
    - Pending Orders (s: newOrder) (t: createOrder(newOrder)) 
        - createOrder is our resolver that will trigger the 'newOrder' event
    - Order Status (s: orderUpdate) (t: editOrder(orderUpdate)) -> (Owner, Client/Customer, Driver)
    - Pending Pickup Order (s: orderUpdate) (t: editOrder(orderUpdate)) -> (Driver)

- Payments (CRON)

## Restaurant Model:

- id
- createdAt
- updatedAt

- name
- category
- address
- coverImage

## Restaurant CRUD:

- Edit Restaurant
- Delete Restaurant

- See Categories
- See Restaurants by Category (pagination)
- See Restaurants (pagination)
- See Restaurant
- Search Restaurants

- Create Dish
- Edit Dish
- Delete Dish

## User Model:

- id
- createdAt
- updatedAt

- email
- password
- role(client|owner|delivery)

## User CRUD:

- Create Account
- Log In
- See Profile
- Edit Profile
- Verify Email