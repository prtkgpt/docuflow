import { PostEditor } from "@/components/admin/PostEditor";

export default function NewPostPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">New post</h1>
      <PostEditor
        initial={{
          slug: "",
          title: "",
          description: "",
          category: "PDF editing",
          body: "",
          answer: "",
          primaryToolHref: "",
          primaryToolLabel: "",
          relatedToolSlugs: "",
          faqJson: "",
          published: false,
        }}
      />
    </>
  );
}
