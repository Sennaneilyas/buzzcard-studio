import { Newspaper } from "lucide-react";
import SectionHeading from "./SectionHeading";

/**
 * SectionBlog — 2-column grid: thumbnail + title + excerpt.
 */

const DEMO_POSTS = [
  {
    title: "Prepare Your A/C Unit",
    excerpt:
      "Lorem ipsum is simply dummy text of the printing and type setting industry.",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=400&auto=format&fit=crop",
  },
  {
    title: "The Best Time To Grow",
    excerpt:
      "Lorem ipsum is simply dummy text of the printing and type setting industry.",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=400&auto=format&fit=crop",
  },
];

export default function SectionBlog({ data = {} }) {
  const posts = data.posts?.length ? data.posts : DEMO_POSTS;

  return (
    <section className="px-6 py-8">
      <SectionHeading title="Blog" icon={Newspaper} />

      <div className="grid grid-cols-2 gap-3">
        {posts.map((post, i) => (
          <div
            key={i}
            className="overflow-hidden flex flex-col"
            style={{
              backgroundColor: "var(--t-bg-section)",
              borderRadius: "var(--t-card-radius)",
              boxShadow: "var(--t-card-shadow)",
            }}
          >
            {/* Thumbnail */}
            <div className="aspect-video overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col gap-1">
              <h4
                className="text-xs font-bold line-clamp-2"
                style={{
                  fontFamily: "var(--t-font-heading)",
                  color: "var(--t-text-primary)",
                }}
              >
                {post.title}
              </h4>
              <p
                className="text-[10px] leading-relaxed line-clamp-3"
                style={{ color: "var(--t-text-secondary)" }}
              >
                {post.excerpt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
