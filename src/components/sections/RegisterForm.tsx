"use client";
import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { registerAction, INITIAL_FORM_STATE } from "@/app/actions";
import { cn } from "@/lib/utils";

const fieldBase =
  "bg-transparent border-b py-3 text-body transition-colors rounded-none placeholder:text-[var(--color-gray-500)] focus-visible:border-[var(--color-red)]";

/** Border flashes to red on error and holds — never a shake (ANIMATIONS.md §5). */
function inputClass(hasError: boolean) {
  return cn(
    fieldBase,
    hasError
      ? "border-[var(--color-red)] animate-field-flash"
      : "border-[var(--color-gray-300)]",
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, INITIAL_FORM_STATE);
  const errors = state.errors ?? {};

  if (state.status === "success") {
    return (
      <div
        className="flex max-w-2xl flex-col items-start gap-4 border-l-2 border-[var(--color-red)] pl-8 py-4"
        role="status"
      >
        {/* Checkmark glyph, not a green banner (UI_GUIDELINES.md §5) */}
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-red)" strokeWidth="1.5" aria-hidden="true">
          <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className="text-display-m font-heading text-white">You&rsquo;re in.</h3>
        <p className="text-body-l text-[var(--color-gray-300)]">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="flex flex-col gap-8 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="fullName" className="text-small font-semibold">Full Name</label>
          <input
            type="text" id="fullName" name="fullName"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className={inputClass(!!errors.fullName)}
            placeholder="Jane Doe"
          />
          {errors.fullName && <p id="fullName-error" className="text-small text-[var(--color-red)]">{errors.fullName}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-small font-semibold">Email Address</label>
          <input
            type="email" id="email" name="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClass(!!errors.email)}
            placeholder="jane@example.com"
          />
          {errors.email && <p id="email-error" className="text-small text-[var(--color-red)]">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-small font-semibold">Phone Number</label>
          <input
            type="tel" id="phone" name="phone"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={inputClass(!!errors.phone)}
            placeholder="+91 98765 43210"
          />
          {errors.phone && <p id="phone-error" className="text-small text-[var(--color-red)]">{errors.phone}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="isStudent" className="text-small font-semibold">Are you a student?</label>
          <select
            id="isStudent" name="isStudent" defaultValue=""
            aria-invalid={!!errors.isStudent}
            aria-describedby={errors.isStudent ? "isStudent-error" : undefined}
            className={cn(inputClass(!!errors.isStudent), "cursor-pointer")}
          >
            <option value="" disabled>Select an option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.isStudent && <p id="isStudent-error" className="text-small text-[var(--color-red)]">{errors.isStudent}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="organization" className="text-small font-semibold">College / Organization</label>
        <input
          type="text" id="organization" name="organization"
          aria-invalid={!!errors.organization}
          aria-describedby={errors.organization ? "organization-error" : undefined}
          className={inputClass(!!errors.organization)}
          placeholder="Rathinam Technical Campus"
        />
        {errors.organization && <p id="organization-error" className="text-small text-[var(--color-red)]">{errors.organization}</p>}
      </div>

      <div className="mt-4 flex flex-col items-start gap-4">
        <Button type="submit" disabled={pending} className="w-full md:w-auto disabled:opacity-60">
          {pending ? "Reserving…" : "Reserve My Spot"}
        </Button>
        <p className="text-small text-[var(--color-gray-500)]">
          Free entry for RTC students · Limited seats for external participants ·{" "}
          <Link href="/privacy" className="underline hover:text-[var(--color-red)]">Privacy Policy</Link>
        </p>
      </div>
    </form>
  );
}
