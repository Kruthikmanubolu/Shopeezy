import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";
import { M_PLUS_1 } from "next/font/google";
import { Description } from "@radix-ui/react-dialog";

const currency = z
  .string()
  .refine(
    (value) =>
      /^\d+(\.\d{2})?/.test(formatNumberWithDecimal(Number(value).toString())),
    "price must exactly two decimal places"
  );

// Schema for inserting products

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have atleast 1 image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

//Schema for updating products

export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, "Id is required"),
});

//Schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be atleast 6 characters"),
});

//Schema for signup

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be atleat characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be atleast 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Cart schemas

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(1, "Image is required"),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session card id is required"),
  userId: z.string().optional().nullable(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be atleast 3 characters"),
  streetAddress: z.string().min(3, "Address must be atleast 3 characters"),
  city: z.string().min(3, "city must be atleast 3 characters"),
  postalCode: z.string().min(3, "Postal Code must be atleast 3 characters"),
  country: z.string().min(3, "country must be atleast 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

//Schema for payment methods

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment methods is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

//Schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z
    .string()
    .refine((data) => PAYMENT_METHODS.includes(data), {
      message: "Invalid payment method",
    }),
  shippingAddress: shippingAddressSchema,
});

//Schema for inserting order item

export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  price_Paid: z.string(),
});

//update userprofile

export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be 3 characters"),
  email: z.string().min(3, "Email must be 3 characters"),
});

export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "ID is required"),
  role: z.string().min(1, "Role is required"),
});

export const insertReviewSchema = z.object({
  title: z.string().min(3, "Title must be three characters"),
  description: z.string().min(3, "Description must be three characters"),
  productId: z.string().min(1, "Product is required"),
  userId: z.string().min(1, "User is required"),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be atleast 1")
    .max(5, "Rating must be atmost 5"),
});
