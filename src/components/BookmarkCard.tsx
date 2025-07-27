import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLinkIcon, EditIcon, TrashIcon } from "lucide-react";
import { FrontendBookmark } from "@/lib/api";

interface BookmarkCardProps {
    bookmark: FrontendBookmark;
    onEdit: (bookmark: FrontendBookmark) => void;
    onDelete: (id: string) => void;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({
    bookmark,
    onEdit,
    onDelete,
}) => {

    const handleVisit = () => {
        window.open(bookmark.url, "_blank", "noopener,noreferrer");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <Card className="group hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {bookmark.title}
                    </CardTitle>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(bookmark)}
                            className="h-8 w-8 p-0"
                            title="Edit bookmark"
                        >
                            <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(bookmark.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            title="Delete bookmark"
                        >
                            <TrashIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {bookmark.description}
                </p>



                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                        {formatDate(bookmark.createdAt)}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleVisit}
                        className="flex items-center space-x-1"
                    >
                        <ExternalLinkIcon className="h-3 w-3" />
                        <span>Visit</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};