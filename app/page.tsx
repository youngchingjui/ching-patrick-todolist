import { revalidatePath } from "next/cache";
import prisma from "./lib/prisma";

// Server actions
async function createTodo(formData: FormData) {
  "use server";
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim() || undefined;
  if (!title) return;
  await prisma.todo.create({ data: { title, description } });
  revalidatePath("/");
}

async function updateTodoTitle(id: number, formData: FormData) {
  "use server";
  const title = String(formData.get("title") || "").trim();
  const descriptionRaw = formData.get("description");
  const description = descriptionRaw !== null ? String(descriptionRaw).trim() : undefined;
  if (!title) return;
  await prisma.todo.update({ where: { id }, data: { title, description } });
  revalidatePath("/");
}

async function toggleTodo(id: number) {
  "use server";
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) return;
  await prisma.todo.update({ where: { id }, data: { completed: !todo.completed } });
  revalidatePath("/");
}

async function deleteTodo(id: number) {
  "use server";
  await prisma.todo.delete({ where: { id } });
  revalidatePath("/");
}

export default async function Home() {
  const todos = await prisma.todo.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="font-sans min-h-screen p-8 sm:p-12">
      <main className="mx-auto max-w-2xl flex flex-col gap-8">
        <h1 className="text-2xl font-semibold">To-do List</h1>

        {/* Create */}
        <form action={createTodo} className="flex flex-col gap-2 rounded-lg border border-black/10 dark:border-white/15 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              name="title"
              placeholder="What do you need to do?"
              className="flex-1 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none"
              required
            />
            <button type="submit" className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90">
              Add
            </button>
          </div>
          <textarea
            name="description"
            placeholder="Optional description"
            className="rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none resize-y min-h-10"
          />
        </form>

        {/* List */}
        <ul className="flex flex-col gap-4">
          {todos.length === 0 && (
            <li className="text-sm text-black/60 dark:text-white/60">No todos yet. Add one above.</li>
          )}
          {todos.map((t) => (
            <li key={t.id} className="rounded-lg border border-black/10 dark:border-white/15 p-4">
              <div className="flex items-start gap-3">
                {/* Toggle */}
                <form action={toggleTodo.bind(null, t.id)}>
                  <button
                    type="submit"
                    title={t.completed ? "Mark as incomplete" : "Mark as complete"}
                    className={`size-5 rounded border border-black/15 dark:border-white/20 inline-flex items-center justify-center ${
                      t.completed ? "bg-green-600" : "bg-transparent"
                    }`}
                    aria-pressed={t.completed}
                  >
                    {t.completed ? "✓" : ""}
                  </button>
                </form>

                {/* Edit */}
                <div className="flex-1">
                  <form action={updateTodoTitle.bind(null, t.id)} className="flex flex-col gap-2">
                    <input
                      type="text"
                      name="title"
                      defaultValue={t.title}
                      className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none line-through:data-[completed=true]"
                      data-completed={t.completed}
                      required
                    />
                    <textarea
                      name="description"
                      defaultValue={t.description ?? ""}
                      placeholder="Add a description (optional)"
                      className="rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none resize-y min-h-10"
                    />
                    <div className="flex gap-2 justify-end">
                      <button type="submit" className="rounded-md border border-black/10 dark:border-white/20 px-3 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/10">
                        Save
                      </button>
                    </div>
                  </form>
                </div>

                {/* Delete */}
                <form action={deleteTodo.bind(null, t.id)} className="self-start">
                  <button
                    type="submit"
                    className="rounded-md border border-red-500/40 text-red-600 dark:text-red-400 px-3 py-1 text-sm hover:bg-red-500/10"
                    title="Delete"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

