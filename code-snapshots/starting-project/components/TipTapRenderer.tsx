import React from "react";

type Mark = { type: "bold" } | { type: "italic" } | { type: "code" };

type TextNode = {
  type: "text";
  text: string;
  marks?: Mark[];
};

type ElementNode = {
  type:
    | "doc"
    | "paragraph"
    | "heading"
    | "bulletList"
    | "orderedList"
    | "listItem"
    | "codeBlock"
    | "horizontalRule";
  attrs?: { level?: 1 | 2 | 3 };
  content?: TipTapNode[];
};

type TipTapNode = TextNode | ElementNode;

function renderNode(node: TipTapNode, key: number): React.ReactNode {
  if (node.type === "text") {
    let content: React.ReactNode = node.text;
    if (node.marks) {
      for (const mark of node.marks) {
        if (mark.type === "bold") {
          content = <strong key={key} className="font-semibold">{content}</strong>;
        } else if (mark.type === "italic") {
          content = <em key={key}>{content}</em>;
        } else if (mark.type === "code") {
          content = (
            <code key={key} className="rounded bg-gray-100 px-1 font-mono text-sm dark:bg-gray-800">
              {content}
            </code>
          );
        }
      }
    }
    return content;
  }

  const children = node.content?.map((child, i) => renderNode(child, i));

  switch (node.type) {
    case "doc":
      return <React.Fragment key={key}>{children}</React.Fragment>;
    case "paragraph":
      return <p key={key} className="my-2 leading-7">{children}</p>;
    case "heading": {
      const level = node.attrs?.level ?? 1;
      if (level === 1)
        return <h1 key={key} className="mt-6 mb-2 text-2xl font-bold">{children}</h1>;
      if (level === 2)
        return <h2 key={key} className="mt-5 mb-1 text-xl font-bold">{children}</h2>;
      return <h3 key={key} className="mt-4 mb-1 text-lg font-semibold">{children}</h3>;
    }
    case "bulletList":
      return <ul key={key} className="my-3 list-disc pl-6 space-y-1">{children}</ul>;
    case "orderedList":
      return <ol key={key} className="my-3 list-decimal pl-6 space-y-1">{children}</ol>;
    case "listItem":
      return <li key={key} className="leading-7">{children}</li>;
    case "codeBlock":
      return (
        <pre key={key} className="my-4 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
          <code className="font-mono text-sm">{children}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr key={key} className="my-6 border-gray-200 dark:border-gray-700" />;
    default:
      return null;
  }
}

export default function TipTapRenderer({ contentJson }: { contentJson: string }) {
  let doc: TipTapNode;
  try {
    doc = JSON.parse(contentJson) as TipTapNode;
  } catch {
    return <p className="text-sm text-red-500">Could not render note content.</p>;
  }

  return (
    <div className="text-gray-900 dark:text-white">
      {renderNode(doc, 0)}
    </div>
  );
}
