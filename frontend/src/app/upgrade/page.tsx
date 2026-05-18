"use client";

import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createCheckoutSession } from "@/lib/billingApi";
import { createCustomerPortalSession } from "@/lib/clientApi";
import { showError } from "@/lib/toastUtils";

export default function UpgradePage() {
  async function handleUpgrade() {
    try {
      const data = await createCheckoutSession();

      // Redirect user to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      showError(error, "Unable to start checkout");
    }
  }

  async function handleManageSubscription() {
    try {
      const response = await createCustomerPortalSession();

      window.location.href = response.url;
    } catch (error) {
      showError(error, "Unable to open subscription management");
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="mx-auto max-w-7xl space-y-6 md:space-y-8">
          {/* <div className="mx-auto max-w-4xl"> */}
          <div className="rounded-2xl bg-white p-8 shadow">
            <h1 className="text-3xl font-bold text-slate-900">
              Upgrade to PRO
            </h1>

            <p className="mt-3 text-slate-600">
              Unlock unlimited clients, projects, and invoices.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border p-6">
                <h2 className="text-xl font-semibold">Free</h2>
                <p className="mt-2 text-slate-500">For testing the app.</p>

                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>✅ 3 clients</li>
                  <li>✅ 3 projects</li>
                  <li>✅ 3 invoices</li>
                  <li>✅ Basic dashboard</li>
                </ul>
              </div>

              <div className="rounded-xl border-2 border-blue-600 p-6">
                <h2 className="text-xl font-semibold text-blue-700">PRO</h2>
                <p className="mt-2 text-slate-500">For serious freelancers.</p>

                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>✅ Unlimited clients</li>
                  <li>✅ Unlimited projects</li>
                  <li>✅ Unlimited invoices</li>
                  <li>✅ Full revenue dashboard</li>
                </ul>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleUpgrade}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                  >
                    Upgrade with Stripe
                  </button>

                  <button
                    onClick={handleManageSubscription}
                    className="w-full rounded-lg bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-900"
                  >
                    Manage Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
