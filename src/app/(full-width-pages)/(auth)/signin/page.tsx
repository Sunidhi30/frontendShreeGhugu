import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ghutargooe",
  description: "Ghutargoo",
};

export default function SignIn() {
  return <SignInForm />;
}
