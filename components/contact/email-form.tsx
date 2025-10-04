"use client";
import type { NextPage } from "next";
import React, { useMemo, useRef, useState } from "react";
import NameContainer from "@/components/contact/name-container";
import SendButton from "@/components/contact/SendButton";

const NAME_MAX = 80;
const EMAIL_MAX = 254;
const MESSAGE_MAX = 1000;

type Props = {
  className?: string;
  onSend?: (payload: { name: string; email: string; message: string; files: File[] }) => void;
  maxTotalMb?: number; // default 10
};

const EmailForm: NextPage<Props> = ({ className = "", onSend, maxTotalMb = 10 }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const maxTotalBytes = useMemo(() => maxTotalMb * 1024 * 1024, [maxTotalMb]);
  const totalBytes = useMemo(() => files.reduce((s, f) => s + f.size, 0), [files]);
  const totalOk = totalBytes <= maxTotalBytes;

  // HARDER trim
  const trimName = (name: string, max = 16) => {
    if (name.length <= max) return name;
    const head = Math.ceil((max - 1) * 0.6);
    const tail = (max - 1) - head;
    return name.slice(0, head) + "…" + name.slice(-tail);
  };

  // merge + dedupe across multiple selections
  function handleFilesChange(flist: FileList | null) {
    setError(null);
    if (!flist) return;

    const picked = Array.from(flist);
    const merged = [...files, ...picked];

    const seen = new Set<string>();
    const deduped: File[] = [];
    for (const f of merged) {
      const key = `${f.name}__${f.size}__${f.lastModified}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(f);
      }
    }

    const sum = deduped.reduce((s, f) => s + f.size, 0);
    if (sum > maxTotalBytes) {
      setError(`Attachments exceed ${maxTotalMb} MB (selected ${(sum / (1024 * 1024)).toFixed(1)} MB).`);
      return;
    }
    setFiles(deduped);
  }

  function handleSendClick() {
    setError(null);
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in Name, Email, and Message.");
      return;
    }
    if (!totalOk) {
      setError(`Attachments exceed ${maxTotalMb} MB (selected ${(totalBytes / (1024 * 1024)).toFixed(1)} MB).`);
      return;
    }
    onSend?.({ name, email, message, files });
  }

  const fileKey = (f: File) => `${f.name}__${f.size}__${f.lastModified}`;

    function removeFile(key: string) {
    setFiles((prev) => prev.filter((f) => fileKey(f) !== key));
    }

  const messageLeft = Math.max(0, MESSAGE_MAX - message.length);

  return (
    <section className={["flex flex-col items-start justify-center gap-6 text-left text-lg text-white font-urbanist w-full", className].join(" ")}>
      <div className="flex flex-col items-start justify-start gap-6 w-full max-w-[640px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <NameContainer
            id="contact-name"
            titlePlaceholder="Your name"
            placeholder="Name"
            required
            valueForRequired={name}
            inputProps={{
              value: name,
              onChange: (e) => setName(e.currentTarget.value.slice(0, NAME_MAX)),
              maxLength: NAME_MAX,
            }}
          />
          <NameContainer
            id="contact-email"
            titlePlaceholder="Your email"
            typeSectionBorder="1px solid rgba(0, 68, 130, 0.1)"
            placeholder="Email"
            required
            valueForRequired={email}
            inputProps={{
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.currentTarget.value.slice(0, EMAIL_MAX)),
              maxLength: EMAIL_MAX,
              inputMode: "email",
              autoComplete: "email",
            }}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-2.5">
            <label
            htmlFor="contact-message"
            className="relative inline-flex items-center gap-2 cursor-pointer select-none"
            >
            <b className="relative">Your Message</b>
            {!message.trim() && (
                <svg aria-hidden viewBox="0 0 24 24" className="w-3 h-3 text-gray-400">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="12" y1="7" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1.2" fill="currentColor" />
                </svg>
            )}
            </label>

          <div className="border-steelblue border-solid border-[1px] bg-darkslategray shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-2xl w-full box-border flex flex-col">
            <textarea
              id="contact-message"
              className="w-full resize-none bg-transparent border-0 h-[220px] min-h-[220px] px-6 pt-4 pb-3 font-urbanist font-bold text-lg text-gray-200 [outline:none]"
              placeholder="Message"
              value={message}
              maxLength={MESSAGE_MAX}
              onChange={(e) => setMessage(e.currentTarget.value.slice(0, MESSAGE_MAX))}
            />

            <div className="flex flex-col gap-2 px-4 pb-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => inputFileRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-100 hover:opacity-90 transition cursor-pointer"
                    title="Add attachments"
                  >
                    <svg aria-hidden viewBox="0 0 24 24" className="w-4 h-4 text-gray-200 opacity-90" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.44 11.05l-8.49 8.49a5.5 5.5 0 01-7.78-7.78l9.19-9.19a3.5 3.5 0 114.95 4.95l-9.2 9.2a1.5 1.5 0 01-2.12-2.12l8.5-8.5" />
                    </svg>
                    Add attachments
                  </button>

                  <input
                    ref={inputFileRef}
                    type="file"
                    name="attachments"
                    multiple
                    onChange={(e) => handleFilesChange(e.currentTarget.files)}
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.doc,.docx"
                    className="hidden"
                  />
                </div>

                <div className="text-[11px] text-gray-300">
                  <span className="mr-2">Msg: {messageLeft}/{MESSAGE_MAX}</span>
                  <span className="mr-2">Name: {Math.max(0, NAME_MAX - name.length)}/{NAME_MAX}</span>
                  <span>Email: {Math.max(0, EMAIL_MAX - email.length)}/{EMAIL_MAX}</span>
                </div>
              </div>

              {/* EXTRA-SMALL FILE CHIPS */}
            {files.length > 0 && (
            <div className="max-h-20 overflow-auto">
                <div className="flex flex-wrap gap-1.5">
                {files.map((f, i) => {
                    const k = fileKey(f);
                    return (
                    <div
                        key={k}
                        className="flex items-center gap-1.5 rounded-md border border-steelblue/60 bg-[#1e293b]/80 px-2 py-1"
                        title={f.name}
                    >
                        <svg viewBox="0 0 24 24" className="w-3 h-3 text-gray-200" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                        </svg>

                        <span className="text-[11px] font-semibold text-gray-100 truncate max-w-[7rem]">
                        {trimName(f.name, 14)}
                        </span>
                        <span className="text-[10px] text-gray-300">
                        {(f.size / (1024 * 1024)).toFixed(2)} MB
                        </span>

                        {/* Remove (×) */}
                        <button
                        type="button"
                        onClick={() => removeFile(k)}
                        className="ml-0.5 inline-flex items-center justify-center w-4 h-4 rounded hover:bg-white/10 focus:outline-none"
                        aria-label={`Remove ${f.name}`}
                        title="Remove"
                        >
                        <svg viewBox="0 0 24 24" className="w-3 h-3 text-gray-200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                        </button>
                    </div>
                    );
                })}
                </div>
            </div>
            )}

              <div className="text-xs text-gray-300">
                Max total: <span className="font-semibold">{maxTotalMb} MB</span>
                {files.length > 0 && <> · {(totalBytes / (1024 * 1024)).toFixed(2)} MB selected</>}
              </div>
              {!totalOk && (
                <div className="text-xs text-red-400">
                  Attachments exceed {maxTotalMb} MB. Please remove some files.
                </div>
              )}
              {error && totalOk && <div className="text-xs text-red-400">{error}</div>}
            </div>
          </div>
        </div>
      </div>

      <SendButton iconSize={28} onClick={handleSendClick} />
    </section>
  );
};

export default EmailForm;
