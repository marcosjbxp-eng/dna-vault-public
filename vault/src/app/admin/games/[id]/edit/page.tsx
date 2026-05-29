"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gameSchema } from "@/lib/validations/game";
import { Button, Input, Skeleton } from "@/components/ui";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useUIStore } from "@/store/ui.store";

type GameFormValues = z.input<typeof gameSchema>;

export default function EditGamePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { addToast } = useUIStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GameFormValues>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      coverUrl: "",
      images: [],
      trailerUrl: "",
      price: "",
      genres: [],
      platforms: ["PC"],
      developer: "",
      publisher: "",
      releaseDate: "",
      active: true,
      featured: false,
    },
  });

  useEffect(() => {
    async function loadGame() {
      try {
        const res = await fetch(`/api/games/${id}`);
        if (!res.ok) throw new Error("Jogo não encontrado");
        const game = await res.json();
        
        // Formatar releaseDate (Date string/object -> yyyy-MM-dd) para o input HTML type="date"
        const formattedDate = game.releaseDate 
          ? new Date(game.releaseDate).toISOString().split("T")[0] 
          : "";

        reset({
          title: game.title,
          slug: game.slug,
          description: game.description,
          coverUrl: game.coverUrl,
          images: game.images || [],
          trailerUrl: game.trailerUrl || "",
          price: Number(game.price),
          genres: game.genres || [],
          platforms: game.platforms || ["PC"],
          developer: game.developer,
          publisher: game.publisher || "",
          releaseDate: formattedDate,
          active: game.active,
          featured: game.featured,
        });
      } catch {
        addToast("Erro ao carregar os dados do jogo.", "error");
        router.push("/admin/games");
      } finally {
        setFetching(false);
      }
    }
    if (id) loadGame();
  }, [id, reset, router, addToast]);

  // Auto-generate slug from title

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("title", val);
    setValue(
      "slug",
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  const onSubmit = async (values: GameFormValues) => {
    setLoading(true);
    try {
      const data = gameSchema.parse(values);
      const res = await fetch(`/api/games/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erro ao salvar alterações");

      addToast("Jogo atualizado com sucesso!", "success");
      router.push("/admin/games");
      router.refresh();
    } catch {
      addToast("Erro ao atualizar o jogo.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        <div className="bg-[--surface] border border-[--border] rounded-md p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-28 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/games">
          <Button variant="ghost" size="sm" className="px-2">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-[--white]">Editar Jogo</h1>
          <p className="text-[--smoke] text-sm mt-1">Modificar dados de catálogo.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-[--surface] border border-[--border] rounded-md p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Título *"
              {...register("title")}
              onChange={handleTitleChange}
              error={errors.title?.message}
            />
            <Input
              label="Slug *"
              {...register("slug")}
              error={errors.slug?.message}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[--smoke] mb-1.5 block">
              Descrição *
            </label>
            <textarea
              {...register("description")}
              className="w-full bg-[--panel] border border-[--border] rounded-none px-4 py-3 text-sm text-[--mist] min-h-[120px] focus:outline-none focus:border-[--ice-dim]"
            />
            {errors.description && <p className="text-xs text-[--danger] mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="URL da Capa *"
              {...register("coverUrl")}
              error={errors.coverUrl?.message}
            />
            <Input
              label="URL do Trailer (Opcional)"
              {...register("trailerUrl")}
              error={errors.trailerUrl?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Preço (R$) *"
              type="number"
              step="0.01"
              {...register("price")}
              error={errors.price?.message}
            />
            <Input
              label="Desenvolvedor *"
              {...register("developer")}
              error={errors.developer?.message}
            />
            <Input
              label="Data de Lançamento *"
              type="date"
              {...register("releaseDate")}
              error={errors.releaseDate?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-[--smoke] mb-1.5 block">
                Gêneros (separados por vírgula) *
              </label>
              <Input
                // Usando a prop defaultValue para preencher no início com as gêneros atuais concatenados por vírgula
                defaultValue={watch("genres")?.join(", ")}
                onChange={(e) => {
                  const arr = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                  setValue("genres", arr);
                }}
                placeholder="Ex: RPG, Ação, Aventura"
                error={errors.genres?.message}
              />
            </div>
            <div className="flex items-center gap-4 mt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register("featured")} className="w-4 h-4 rounded border-[--border] bg-[--panel] text-[--flare]" />
                <span className="text-sm text-[--mist]">Destacar na Home</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/games">
            <Button type="button" variant="ghost">Cancelar</Button>
          </Link>
          <Button type="submit" loading={loading}>
            <Save size={18} /> Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  );
}
