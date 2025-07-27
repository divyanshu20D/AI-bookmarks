import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XIcon } from "lucide-react";
import { FrontendBookmark, addBookmark, updateBookmark } from "@/lib/api";

interface AddBookmarkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void; // Trigger refresh after add/edit
    editBookmark?: FrontendBookmark | null; // Bookmark to edit (null for add mode)
}

export const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editBookmark,
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const isEditMode = !!editBookmark;

    // Populate form when editing
    useEffect(() => {
        if (editBookmark) {
            setTitle(editBookmark.title);
            setDescription(editBookmark.description);
            setUrl(editBookmark.url);
        } else {
            // Reset form for add mode
            setTitle("");
            setDescription("");
            setUrl("");
        }
        setError("");
    }, [editBookmark, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const bookmarkData = {
                title,
                description,
                url,
            };

            if (isEditMode && editBookmark) {
                await updateBookmark(editBookmark.id, bookmarkData);
            } else {
                await addBookmark(bookmarkData);
            }

            onSave(); // Trigger refresh

            // Reset form
            setTitle("");
            setDescription("");
            setUrl("");
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'add'} bookmark`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{isEditMode ? 'Edit Bookmark' : 'Add New Bookmark'}</CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <XIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">
                                Title
                            </label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Enter bookmark title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="url" className="text-sm font-medium">
                                URL
                            </label>
                            <Input
                                id="url"
                                type="url"
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">
                                Description
                            </label>
                            <textarea
                                id="description"
                                placeholder="Enter a brief description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            />
                        </div>



                        <div className="flex space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="flex-1">
                                {isLoading
                                    ? (isEditMode ? "Updating..." : "Adding...")
                                    : (isEditMode ? "Update Bookmark" : "Add Bookmark")
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};