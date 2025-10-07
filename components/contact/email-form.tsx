"use client";
import type { NextPage } from "next";
import React, { useEffect, useMemo, useRef, useState } from "react";
import NameContainer from "@/components/contact/name-container";
import SendButton from "@/components/contact/SendButton";
import { isValidEmail, NAME_MAX, EMAIL_MAX, MESSAGE_MAX } from "@/lib/contact/validate";

type Props = {
  className?: string;
  onSend?: (payload: { name: string; email: string; message: string; files: File[] }) => Promise<boolean> | boolean;
  maxTotalMb?: number; 
  showMobileIcons?: boolean; 
};

type LinkItem = { id: number; title: string; href: string; svgPath: string; viewBox?: string };

/**
 * EmailForm
 *
 * A fully controlled, accessible contact form React component for collecting a user's
 * name, email address, message, and optional file attachments, then dispatching them
 * via an asynchronous `onSend` handler. Includes:
 *
 * - Input length limits (name, email, message) enforced both via `maxLength` and runtime slicing
 * - Attachment handling with de-duplication, total size cap, removal controls, and live byte summary
 * - Progressive status feedback (idle → sending → sent → auto-reset)
 * - Lightweight responsive layout and mobile-only icon ribbon (when `showMobileIcons` is true)
 * - Graceful failure messaging and basic validation (required fields + email shape)
 *
 * PROPS (inferred from usage):
 * @property className Optional container className to extend styling.
 * @property onSend Optional async callback invoked with `{ name, email, message, files }`.
 *                  Should return `true` on success, `false` (or throw) on failure.
 * @property maxTotalMb Maximum total attachment size (in megabytes). Defaults to 10.
 * @property showMobileIcons When true, fetches an array of social/external link metadata from `/api/contact`
 *                           and renders a horizontally scrollable icon ribbon (intended for mobile viewports).
 *
 * INTERNAL STATE:
 * @state name User-entered name (trimmed externally by length cap).
 * @state email User-entered email address (basic format validation via `isValidEmail`).
 * @state message Message body (length-limited by MESSAGE_MAX).
 * @state files Array of File objects selected via hidden <input type="file" />.
 * @state error A user-facing error string when validation or sending fails.
 * @state links Dynamically fetched external link/icon descriptors (used only if `showMobileIcons` is true).
 * @state status One of "idle" | "sending" | "sent" driving the visual state of the SendButton.
 *
 * KEY RUNTIME UTILITIES:
 * - maxTotalBytes: Derived cap in bytes (MB → bytes).
 * - totalBytes: Aggregate size of all current attachments.
 * - totalOk: Boolean gate (totalBytes <= maxTotalBytes).
 * - trimName(filename, max): Ellipsis-truncates long file names for compact chip display.
 * - stopSpaceBubble(e): Prevents Space key from bubbling (helpful if parent has global hotkeys).
 * - handleFilesChange(fileList):
 *     * Merges previous and newly picked files
 *     * De-duplicates by composite key: name + size + lastModified
 *     * Enforces cumulative size limit before committing
 * - handleSendClick():
 *     * Validates required fields, email shape, and attachment size
 *     * Invokes `onSend` (if provided) and updates status accordingly
 *     * Resets form on success, with auto transition back to idle
 * - removeFile(key): Removes a file from state by its composite key
 * - looksLikeUrl / looksLikePathD: Heuristics to decide how to render dynamic SVG/icon sources safely
 *
 * ACCESSIBILITY & UX NOTES:
 * - Buttons include descriptive `aria-label` where icon-only.
 * - Attachments list uses visually clear chips with remove affordance (×).
 * - Status transitions avoid blocking the UI; user can attempt resend after failure.
 * - Uses semantic form-related elements (labels, inputs, textarea) for better screen reader support.
 * - The mobile icon ribbon hides scrollbars visually while remaining keyboard/assistive accessible.
 *
 * SECURITY CONSIDERATIONS:
 * - Inline SVG strings (`<svg ...>`) are inserted via `dangerouslySetInnerHTML`; ensure server-provided
 *   `links` data is sanitized to avoid XSS if untrusted sources are involved.
 * - Only a constrained set of file types is allowed via the `accept` attribute (still validate server-side).
 *
 * PERFORMANCE:
 * - File size aggregation is O(n) over current attachments; typically small.
 * - Deduplication employs a Set with O(n) complexity for merges.
 * - Controlled inputs intentionally slice strings to guarantee bounds without over-rendering complexity.
 *
 * EXTENSIBILITY:
 * - To add new allowed file types, update the `accept` attribute and server validation accordingly.
 * - To extend validation (e.g., stricter email or anti-spam heuristics), modify `handleSendClick`.
 * - To customize status visuals, adjust or replace `SendButton`.
 *
 * ERROR HANDLING:
 * - User-visible `error` messages are concise and only shown when not overshadowed by size violations.
 * - Sending failures (network or logical) revert to "idle" and prompt user retry.
 *
 * VISUAL / STYLING:
 * - Tailwind utility classes define spacing, borders, colors, and responsive grid behavior.
 * - File chips are scrollable when overflowing vertical space to preserve layout constraints.
 *
 * SAMPLE USAGE:
 * ```
 * <EmailForm
 *   className="mt-8"
 *   maxTotalMb={12}
 *   showMobileIcons
 *   onSend={async ({ name, email, message, files }) => {
 *     // forward to API / email service
 *     const formData = new FormData();
 *     formData.append("name", name);
 *     formData.append("email", email);
 *     formData.append("message", message);
 *     files.forEach(f => formData.append("files", f));
 *     const res = await fetch("/api/send-contact", { method: "POST", body: formData });
 *     return res.ok;
 *   }}
 * />
 * ```
 *
 * RETURN:
 * Renders a section wrapping the contact form, file attachment controls, dynamic counters, a send button,
 * and (optionally) a horizontally scrollable icon ribbon for mobile contexts.
 *
 * LIMITATIONS:
 * - No built-in localization (all strings inline).
 * - Basic email validation—replace `isValidEmail` externally for robust parsing.
 * - Assumes existence/import of NAME_MAX, EMAIL_MAX, MESSAGE_MAX, NameContainer, SendButton, isValidEmail, LinkItem types.
 *
 * TESTING RECOMMENDATIONS:
 * - Verify: empty fields → validation errors
 * - Invalid email shape → error
 * - Attachment size just below/above threshold
 * - Duplicate file selections (same name/size/lastModified) not duplicated
 * - onSend success vs failure paths
 * - Status transitions (sending → sent → idle)
 * - Mobile icons rendering with various `links` payloads (URL, path data, raw <svg>, invalid)
 */
const EmailForm: NextPage<Props> = ({
  className = "",
  onSend,
  maxTotalMb = 10,
  showMobileIcons = false,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle"); 

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!showMobileIcons) return;
    let off = false;
    (async () => {
      try {
        const r = await fetch("/api/contact", { cache: "no-store" });
        if (!r.ok) return;
        const data = (await r.json()) as LinkItem[];
        if (!off && Array.isArray(data)) setLinks(data);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      off = true;
    };
  }, [showMobileIcons]);

  const maxTotalBytes = useMemo(() => maxTotalMb * 1024 * 1024, [maxTotalMb]);
  const totalBytes = useMemo(() => files.reduce((s, f) => s + f.size, 0), [files]);
  const totalOk = totalBytes <= maxTotalBytes;

  const trimName = (v: string, max = 16) => {
    if (v.length <= max) return v;
    const head = Math.ceil((max - 1) * 0.6);
    const tail = (max - 1) - head;
    return v.slice(0, head) + "…" + v.slice(-tail);
  };

  const stopSpaceBubble = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.code === "Space" || (e as any).keyCode === 32) e.stopPropagation();
  };

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

  async function handleSendClick() {
    setError(null);
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in Name, Email, and Message.");
      return;
    }
    if (!totalOk) {
      setError(`Attachments exceed ${maxTotalMb} MB (selected ${(totalBytes / (1024 * 1024)).toFixed(1)} MB).`);
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("sending");
    try {
      const ok = (await onSend?.({ name, email, message, files })) ?? false;
      if (ok) {
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
        setFiles([]);
        setTimeout(() => setStatus("idle"), 1500);
      } else {
        setStatus("idle");
        setError("Failed to send. Please try again.");
      }
    } catch {
      setStatus("idle");
      setError("Failed to send. Please try again.");
    }
  }

  const fileKey = (f: File) => `${f.name}__${f.size}__${f.lastModified}`;
  function removeFile(key: string) {
    setFiles((prev) => prev.filter((f) => fileKey(f) !== key));
  }

  const messageLeft = Math.max(0, MESSAGE_MAX - message.length);

  // Render SVGs exactly as provided
  const looksLikeUrl = (v: string) => /^https?:\/\//i.test(v) || /\.svg(\?|#|$)/i.test(v);
  const looksLikePathD = (v: string) => /^[MmZzLlHhVvCcSsQqTtAa][\d\s,.\-+eE]+/.test(v);

  return (
    <section
      className={[
        "flex flex-col items-start justify-center gap-5 text-left text-white font-urbanist w-full",
        className,
      ].join(" ")}
    >
      <div className="flex flex-col items-start justify-start gap-5 w-full max-w-[520px] sm:max-w-[640px]">
        {/* Name + Email */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
          <NameContainer
            id="contact-name"
            titlePlaceholder="Your name"
            placeholder="Name"
            required
            valueForRequired={name}
            size="sm"
            inputProps={{
              value: name,
              onChange: (e) => setName(e.currentTarget.value.slice(0, NAME_MAX)),
              maxLength: NAME_MAX,
              onKeyDown: stopSpaceBubble,
            }}
          />
          <NameContainer
            id="contact-email"
            titlePlaceholder="Your email"
            typeSectionBorder="1px solid rgba(0, 68, 130, 0.1)"
            placeholder="Email"
            required
            valueForRequired={email}
            size="sm"
            inputProps={{
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.currentTarget.value.slice(0, EMAIL_MAX)),
              maxLength: EMAIL_MAX,
              inputMode: "email",
              autoComplete: "email",
              onKeyDown: stopSpaceBubble,
            }}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-2">
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

          <div className="border-steelblue border-solid border-[1px] bg-darkslategray rounded-2xl w-full box-border flex flex-col shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
            <textarea
              id="contact-message"
              className="w-full resize-none bg-transparent border-0 h-[150px] sm:h-[180px] px-5 pt-3.5 pb-3 font-urbanist font-bold text-lg text-gray-200 [outline:none]"
              placeholder="Message"
              value={message}
              maxLength={MESSAGE_MAX}
              onChange={(e) => setMessage(e.currentTarget.value.slice(0, MESSAGE_MAX))}
              onKeyDown={stopSpaceBubble} // allow spaces and prevent global handlers
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
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-gray-200 opacity-90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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
                    {files.map((f) => {
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

              <div className="text-[11px] text-gray-300">
                Max total: <span className="font-semibold">{maxTotalMb} MB</span>
                {files.length > 0 && <> · {(totalBytes / (1024 * 1024)).toFixed(2)} MB selected</>}
              </div>
              {!totalOk && (
                <div className="text-[11px] text-red-400">
                  Attachments exceed {maxTotalMb} MB. Please remove some files.
                </div>
              )}
              {error && totalOk && <div className="text-[11px] text-red-400">{error}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Send + mobile icon ribbon */}
      <div className="w-full max-w-[520px] sm:max-w-[640px]">
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="scale-[0.9] origin-left">
            {/* Button visuals driven by status; sends only when clicked */}
            <SendButton iconSize={20} onClick={handleSendClick} status={status} />
          </div>

          {showMobileIcons && links.length > 0 && (
            <div
              className="
                lg:hidden flex-1 overflow-x-auto
                grid grid-flow-col auto-cols-max gap-3
                [-ms-overflow-style:none] [scrollbar-width:none]
              "
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {links.map((l) => {
                const v = (l.svgPath || "").trim();
                return (
                  <a
                    key={l.id}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={l.title}
                    title={l.title}
                    className="inline-flex items-center justify-center p-2"
                  >
                    {looksLikeUrl(v) ? (
                      <img
                        src={v}
                        alt=""
                        className="w-6 h-6 select-none pointer-events-none"
                        decoding="async"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : looksLikePathD(v) ? (
                      <svg viewBox={l.viewBox ?? "0 0 24 24"} className="w-6 h-6" aria-hidden="true">
                        <path d={v} />
                      </svg>
                    ) : v.startsWith("<svg") ? (
                      <span
                        className="w-6 h-6 inline-block"
                        aria-hidden="true"
                        dangerouslySetInnerHTML={{ __html: v }}
                      />
                    ) : (
                      <span className="w-6 h-6" aria-hidden="true" />
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EmailForm;
