import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Brand Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-600">Sign in to continue to Exam Portal</p>
      </div>

      {/* Auth Component */}
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl border border-gray-100 rounded-2xl p-6",
            headerTitle: "text-2xl font-semibold text-center text-gray-900",
            headerSubtitle: "text-gray-600 text-center",
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
            formFieldInput: "rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500",
            footerAction: "text-gray-600",
            identityPreviewText: "text-gray-600",
            formFieldLabel: "text-gray-700",
            socialButtonsBlockButton: "border border-gray-200 hover:bg-gray-50 transition duration-200",
            socialButtonsBlockButtonText: "text-gray-600 font-medium",
            dividerLine: "bg-gray-200",
            dividerText: "text-gray-500",
            footer: "hidden",
          },
          layout: {
            socialButtonsPlacement: "bottom",
            showOptionalFields: false,
          },
        }}
      />

      {/* Footer */}
      <div className="mt-8 text-center text-sm">
        <p className="mb-2">
          <span className="text-gray-600">Don&apos;t have an account? </span>
          <Link 
            href="/sign-up" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign up
          </Link>
        </p>
        <p className="text-gray-500">© 2024 Exam Portal. All rights reserved.</p>
      </div>
    </div>
  );
}