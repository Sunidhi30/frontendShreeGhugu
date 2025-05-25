import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gutargoo",
  description: "Gutargoo",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
