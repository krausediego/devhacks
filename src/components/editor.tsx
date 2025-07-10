import "highlight.js/styles/rose-pine-moon.css";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { all, createLowlight } from "lowlight";
import type { Ref } from "react";

const lowlight = createLowlight(all);

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

interface EditorProps {
  ref: Ref<HTMLDivElement> | undefined;
  onChange: (html: string) => void;
  value: string;
}

const Editor = ({ ref, onChange, value }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder: "KAKAKA",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "w-full h-full px-3 py-2 outline-none placeholder:text-muted-foreground text-base",
        autocorrect: "off",
        autocomplete: "off",
        spellcheck: "false",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="prose max-h-96 min-h-60 w-full max-w-none">
      <EditorContent
        ref={ref}
        className="placeholder:text-muted-foreground border-input h-full overflow-y-auto rounded-md border bg-transparent text-base shadow-xs"
        editor={editor}
        onChange={(e) => {
          console.log(e);
        }}
      />
      {editor && (
        <BubbleMenu editor={editor}>
          <button>Bold</button>
        </BubbleMenu>
      )}
    </div>
  );
};

export { Editor };
