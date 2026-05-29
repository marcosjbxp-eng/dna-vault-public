import { z } from "zod";

export const gameSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  coverUrl: z.string().url("URL da capa inválida").or(z.string().min(1)),
  images: z.array(z.string()).default([]),
  trailerUrl: z.string().url("URL do trailer inválida").optional().or(z.literal("")),
  price: z.coerce.number().positive("Preço deve ser positivo"),
  genres: z.array(z.string()).min(1, "Pelo menos um gênero"),
  platforms: z.array(z.string()).min(1, "Pelo menos uma plataforma"),
  developer: z.string().min(1, "Developer é obrigatório"),
  publisher: z.string().optional(),
  releaseDate: z.coerce.date(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

export type GameInput = z.infer<typeof gameSchema>;

export const keyUploadSchema = z.object({
  gameId: z.string().min(1),
  keys: z.array(z.string().min(8, "Key deve ter no mínimo 8 caracteres")),
});

export type KeyUploadInput = z.infer<typeof keyUploadSchema>;
