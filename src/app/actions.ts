"use server";

/**
 * Form server actions (CODE_STYLE.md §2 — Server Actions over hand-rolled client fetch).
 * Validation runs on the server; the client renders returned errors inline.
 *
 * NOTE: delivery is stubbed (logged server-side). Wire a real destination —
 * email/CRM/ticketing platform — where marked before launch. Per TEDX_RULES.md §6,
 * collect only what the action needs and link the privacy policy at the point of collection.
 */

export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  /** Field-keyed validation messages, surfaced via aria-describedby on each input. */
  errors?: Record<string, string>;
}

export const INITIAL_FORM_STATE: FormState = { status: "idle" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const field = (data: FormData, key: string) => String(data.get(key) ?? "").trim();

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const fullName = field(formData, "fullName");
  const email = field(formData, "email");
  const phone = field(formData, "phone");
  const isStudent = field(formData, "isStudent");
  const organization = field(formData, "organization");

  const errors: Record<string, string> = {};
  if (fullName.length < 2) errors.fullName = "Enter your full name.";
  if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
  if (phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a valid phone number.";
  if (isStudent !== "yes" && isStudent !== "no") errors.isStudent = "Select an option.";
  if (organization.length < 2) errors.organization = "Enter your college or organization.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, message: "Please fix the highlighted fields." };
  }

  // TODO: wire real delivery (email/CRM/ticketing platform). Logged server-side for now.
  console.info("[register] reservation", { fullName, email, phone, isStudent, organization });

  return {
    status: "success",
    message: `You're on the list, ${fullName.split(" ")[0]}. Watch your inbox for confirmation.`,
  };
}
