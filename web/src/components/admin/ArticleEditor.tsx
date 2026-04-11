import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { ImageUploader } from './ImageUploader';

interface ArticleEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function ArticleEditor({ content, onChange }: ArticleEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({ placeholder: '开始写作...' }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = (url: string) => {
    editor?.chain().focus().setImage({ src: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="border border-[var(--foreground)]/20 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 p-2 border-b border-[var(--foreground)]/20 bg-[var(--foreground)]/5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded font-bold ${editor.isActive('bold') ? 'bg-[var(--foreground)]/20' : ''}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded italic ${editor.isActive('italic') ? 'bg-[var(--foreground)]/20' : ''}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded ${editor.isActive('heading') ? 'bg-[var(--foreground)]/20' : ''}`}
        >
          H
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-[var(--foreground)]/20' : ''}`}
        >
          •
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 rounded ${editor.isActive('blockquote') ? 'bg-[var(--foreground)]/20' : ''}`}
        >
          "
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-2 py-1 rounded ${editor.isActive('codeBlock') ? 'bg-[var(--foreground)]/20' : ''}`}
        >
          {'</>'}
        </button>
        <div className="w-px h-6 bg-[var(--foreground)]/20 mx-1" />
        <ImageUploader onUpload={handleImageUpload} />
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[400px]" />
    </div>
  );
}