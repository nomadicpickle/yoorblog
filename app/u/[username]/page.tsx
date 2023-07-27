import { clerkClient } from "@clerk/nextjs";
import db from "@/utils/database";
import Card from "@/components/server/card";

type Props = {
  params: {
    username: string;
    page?: string;
  };
};

export default async function Blogs({ params }: Props) {
  const users = await clerkClient.users.getUserList({
    username: [params.username],
  });

  if (users.length == 0) {
    return (
      <main className="flex min-h-screen flex-col">
        <div className="w-full my-6 flex flex-col flex-grow items-center justify-center md:flex-row md:flex-wrap">
          <h1 className="text-4xl font-bold">No User Found!</h1>
        </div>
      </main>
    );
  }

  const user = users[0];

  const blogs = await db.post.findMany({
    where: {
      user_id: user.id,
    },
    orderBy: [
      {
        created_at: "desc",
      },
      { id: "desc" },
    ],
    take: 9,
  });

  return (
    <main className="flex min-h-screen flex-col">
      <div className="w-full my-6 flex flex-col flex-grow justify-center md:flex-row md:flex-wrap">
        {blogs?.map((blog, index) => {
          return (
            <Card
              key={index}
              title={blog.title}
              author={user.username}
              content={blog.content}
              date={blog.created_at}
              link={`/u/${user.username}/b/${blog.slug}`}
            />
          );
        })}
      </div>
    </main>
  );
}
