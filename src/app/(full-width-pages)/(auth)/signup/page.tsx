import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ghutargoo",
  description: "Ghutargoo",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
