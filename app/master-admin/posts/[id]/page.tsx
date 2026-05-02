import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } }).catch(() => null);
  if (!post) notFound();
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Edit post</h1>
      <PostEditor
        initial={{
          id: post.id,
          slug: post.slug,
          title: post.title,
          description: post.description,
          category: post.category,
          body: post.body,
          answer: post.answer ?? "",
          primaryToolHref: post.primaryToolHref ?? "",
          primaryToolLabel: post.primaryToolLabel ?? "",
          relatedToolSlugs: post.relatedToolSlugs ?? "",
          faqJson: post.faqJson ?? "",
          published: post.published,
        }}
      />
    </>
  );
}
