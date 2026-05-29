import type { Game, Key, Order, OrderItem, User } from "@prisma/client";

export type { Game, Key, Order, OrderItem, User };

export interface CartItem {
  gameId: string;
  title: string;
  coverUrl: string;
  price: number;
  quantity: number;
  slug: string;
}

export interface GameWithKeys extends Game {
  keys: Key[];
  _count?: {
    keys: number;
  };
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { game: Game })[];
  keys: Key[];
  user: User;
}

export interface StoreStats {
  totalGames: number;
  totalKeysAvailable: number;
  keysDeliveredToday: number;
  totalRevenue: number;
  monthRevenue: number;
}
