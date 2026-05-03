import Link from "next/link";
import { Plus, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getPosts() {
  try {
    return await prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function AdminHome() {
  const posts = await getPosts();
  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/master-admin/ai-cost"><Activity className="h-4 w-4" /> AI cost dashboard</Link>
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog posts</h1>
          <p className="text-sm text-slate-600">Create, edit, and publish posts on mypdfkitty.com/blog.</p>
        </div>
        <Button asChild><Link href="/master-admin/posts/new"><Plus className="h-4 w-4" /> New post</Link></Button>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <FileText className="mx-auto h-6 w-6" />
            <p className="mt-2 text-sm">No posts yet. Create your first one.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-slate-600">{p.slug}</td>
                  <td className="px-4 py-3 text-slate-600">{p.category}</td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">Published</span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">Draft</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(p.updatedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link className="text-brand-700 hover:underline" href={`/master-admin/posts/${p.id}`}>Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
