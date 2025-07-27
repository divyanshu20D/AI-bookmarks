export interface Bookmark {
    id: string;
    title: string;
    description: string;
    url: string;
    tags: string[];
    createdAt: string;
}

export const mockBookmarks: Bookmark[] = [
    {
        id: "1",
        title: "Next.js Documentation",
        description: "The official Next.js documentation with guides and API reference.",
        url: "https://nextjs.org/docs",
        tags: ["nextjs", "react", "documentation"],
        createdAt: "2023-06-15T10:30:00Z",
    },
    {
        id: "2",
        title: "React Hooks Explained",
        description: "A comprehensive guide to React Hooks with practical examples.",
        url: "https://reactjs.org/docs/hooks-intro.html",
        tags: ["react", "hooks", "frontend"],
        createdAt: "2023-06-10T14:45:00Z",
    },
    {
        id: "3",
        title: "TypeScript Handbook",
        description: "Learn TypeScript from the ground up with this detailed handbook.",
        url: "https://www.typescriptlang.org/docs/handbook/intro.html",
        tags: ["typescript", "javascript", "programming"],
        createdAt: "2023-06-05T09:15:00Z",
    },
    {
        id: "4",
        title: "Tailwind CSS Documentation",
        description: "Official documentation for the utility-first CSS framework.",
        url: "https://tailwindcss.com/docs",
        tags: ["css", "tailwind", "frontend"],
        createdAt: "2023-06-01T16:20:00Z",
    },
    {
        id: "5",
        title: "Prisma ORM Documentation",
        description: "Learn how to use Prisma ORM for your database needs.",
        url: "https://www.prisma.io/docs",
        tags: ["database", "orm", "prisma"],
        createdAt: "2023-05-28T11:10:00Z",
    },
];