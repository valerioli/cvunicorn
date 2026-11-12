"use client";

import { useRef, useState } from "react";
import type { UploadedFile } from "@/lib/intake";
import { useLanguage } from "@/components/i18n";

export function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <span className="mb-1.5 block text-sm font-normal text-[#061b31]">
      {children}
      {hint && <span className="ml-2 text-xs font-normal text-[#64748d]">{hint}</span>}
    </span>
  );
}

export function TextField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  const { language } = useLanguage();
  return (
    <label className="block">
      <Label hint={props.hint ?? (props.required ? undefined : language === "zh" ? "选填" : "optional")}>
        {props.label}
      </Label>
      <input
        className="field"
        type={props.type ?? "text"}
        value={props.value}
        required={props.required}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  );
}

export function TextArea(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  const { language } = useLanguage();
  return (
    <label className="block">
      <Label hint={props.hint ?? (language === "zh" ? "选填" : "optional")}>{props.label}</Label>
      <textarea
        className="field resize-y"
        rows={props.rows ?? 4}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  );
}

async function uploadFile(file: File): Promise<UploadedFile> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error((await res.text()) || "Upload failed");
  return (await res.json()) as UploadedFile;
}

export function FileDrop(props: {
  label: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
}) {
  const { language } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFiles(list: FileList | null) {
    if (busy || !list || list.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const uploaded: UploadedFile[] = [];
      for (const f of Array.from(list).slice(0, props.multiple ? undefined : 1)) {
        if (f.size > 4 * 1024 * 1024) {
          setError(`"${f.name}" is over 4MB — please use a smaller file.`);
          continue;
        }
        uploaded.push(await uploadFile(f));
      }
      if (uploaded.length) props.onChange(
        props.multiple ? [...props.files, ...uploaded] : uploaded.slice(0, 1),
      );
    } catch {
      setError("Upload failed — please try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <Label hint={props.hint}>{props.label}</Label>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload ${props.label}`}
        aria-disabled={busy}
        aria-busy={busy}
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !busy) { e.preventDefault(); inputRef.current?.click(); } }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[4px] border border-dashed px-4 py-7 text-center transition ${
          dragOver
            ? "border-[#533afd] bg-[#f8fafd]"
            : "border-[#d6d9fc] bg-white hover:border-[#533afd] hover:bg-[#f8fafd]"
        }`}
      >
        <svg className="h-6 w-6 text-[#533afd]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 16V4m0 0 4 4m-4-4-4 4" />
          <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
        <p className="text-sm text-[#061b31]">
          {busy ? (language === "zh" ? "正在上传…" : "Uploading…") : (language === "zh" ? "拖入文件或点击选择" : "Drop files here or click to browse")}
        </p>
        {props.accept && (
          <p className="text-xs text-[#64748d]">{props.accept.replaceAll(",", " · ")}</p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={props.accept}
        multiple={props.multiple}
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p role="alert" className="mt-2 text-xs text-[#533afd]">{error}</p>}
      {props.files.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {props.files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-2 rounded-[4px] border border-[#e5edf5] bg-[#f8fafd] py-1.5 pl-3 pr-1.5 text-xs text-[#50617a]"
            >
              <span className="max-w-40 truncate">{f.name}</span>
              {typeof f.extractedCharCount === "number" && f.extractedCharCount > 0 && (
                <span className="rounded-[3px] bg-white px-1.5 py-0.5 text-[#1f7a4d]">
                  {language === "zh" ? "已提取文字" : "text extracted"}
                </span>
              )}
              <button
                type="button"
                aria-label={`Remove ${f.name}`}
                onClick={() =>
                  props.onChange(props.files.filter((x) => x.id !== f.id))
                }
                className="rounded-[4px] p-1 text-[#64748d] hover:bg-[#e8e9ff] hover:text-[#533afd]"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </li>
          ))}
        </ul>
      )}
      {props.files.some((f) => f.extractionError) && (
        <div className="mt-2 space-y-1">
          {props.files
            .filter((f) => f.extractionError)
            .map((f) => (
              <p key={`${f.id}-extract-error`} className="text-xs leading-relaxed text-[#533afd]">
                {f.extractionError}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}
