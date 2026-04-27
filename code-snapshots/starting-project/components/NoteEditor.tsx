"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  initialContent?: object;
  onChange?: (json: object) => void;
};

function ToolbarButton({
  onClick,
  isActive,
  label,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  label: string;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
        isActive
          ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
      }`}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <div aria-hidden className="mx-1 w-px self-stretch bg-gray-200 dark:bg-gray-700" />;
}

export default function NoteEditor({ initialContent, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
    content: initialContent,
    onUpdate: ({ editor }) => onChange?.(editor.getJSON()),
  });

  if (!editor) return null;

  const e = editor;

  return (
    <div className="overflow-hidden rounded-md border border-gray-300 dark:border-gray-700">
      <div
        role="toolbar"
        aria-label="Text formatting"
        className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-900"
      >
        <ToolbarButton onClick={() => e.chain().focus().toggleBold().run()} isActive={e.isActive("bold")} label="B" title="Bold" />
        <ToolbarButton onClick={() => e.chain().focus().toggleItalic().run()} isActive={e.isActive("italic")} label="I" title="Italic" />
        <Divider />
        <ToolbarButton onClick={() => e.chain().focus().setParagraph().run()} isActive={e.isActive("paragraph")} label="¶" title="Paragraph" />
        <ToolbarButton onClick={() => e.chain().focus().toggleHeading({ level: 1 }).run()} isActive={e.isActive("heading", { level: 1 })} label="H1" title="Heading 1" />
        <ToolbarButton onClick={() => e.chain().focus().toggleHeading({ level: 2 }).run()} isActive={e.isActive("heading", { level: 2 })} label="H2" title="Heading 2" />
        <ToolbarButton onClick={() => e.chain().focus().toggleHeading({ level: 3 }).run()} isActive={e.isActive("heading", { level: 3 })} label="H3" title="Heading 3" />
        <Divider />
        <ToolbarButton onClick={() => e.chain().focus().toggleBulletList().run()} isActive={e.isActive("bulletList")} label="• List" title="Bullet list" />
        <Divider />
        <ToolbarButton onClick={() => e.chain().focus().toggleCode().run()} isActive={e.isActive("code")} label="`code`" title="Inline code" />
        <ToolbarButton onClick={() => e.chain().focus().toggleCodeBlock().run()} isActive={e.isActive("codeBlock")} label="```block" title="Code block" />
        <Divider />
        <ToolbarButton onClick={() => e.chain().focus().setHorizontalRule().run()} label="—" title="Horizontal rule" />
      </div>

      <div className="min-h-48 bg-white px-4 py-3 text-gray-900 dark:bg-gray-950 dark:text-white [&_.tiptap]:outline-none [&_.tiptap_h1]:mb-2 [&_.tiptap_h1]:mt-4 [&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-bold [&_.tiptap_h2]:mb-1 [&_.tiptap_h2]:mt-3 [&_.tiptap_h2]:text-xl [&_.tiptap_h2]:font-bold [&_.tiptap_h3]:mb-1 [&_.tiptap_h3]:mt-3 [&_.tiptap_h3]:text-lg [&_.tiptap_h3]:font-semibold [&_.tiptap_p]:my-1 [&_.tiptap_ul]:my-2 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-6 [&_.tiptap_code]:rounded [&_.tiptap_code]:bg-gray-100 [&_.tiptap_code]:px-1 [&_.tiptap_code]:font-mono [&_.tiptap_code]:text-sm [&_.tiptap_pre]:my-2 [&_.tiptap_pre]:rounded [&_.tiptap_pre]:bg-gray-100 [&_.tiptap_pre]:p-3 [&_.tiptap_pre_code]:bg-transparent [&_.tiptap_pre_code]:p-0 [&_.tiptap_hr]:my-4 [&_.tiptap_hr]:border-gray-300">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
