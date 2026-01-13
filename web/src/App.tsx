import { SYSTEM_RULES, BATCH_STATUS } from '@shared/constants'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <header className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-green-700">Virtual Mandi</h1>
          <p className="text-gray-600 italic">"Trust & Transparency"</p>
        </header>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Core Philosophy</h2>
            <p className="text-gray-700">
              Every product is linked to a known Farmer. We charge a nominal facilitation fee on top of the Farmer's Base Price.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <h2 className="text-lg font-bold text-green-800 mb-2">System Guardrails</h2>
            <ul className="list-disc list-inside space-y-1 text-green-900">
              <li>Facilitation Fee: {SYSTEM_RULES.FACILITATION_FEE_PERCENTAGE}%</li>
              <li>Two-Stage Payment: {SYSTEM_RULES.TWO_STAGE_PAYMENT_ENABLED ? 'Active' : 'Disabled'}</li>
              <li>Farmer Login: {SYSTEM_RULES.FARMER_LOGIN_ENABLED ? 'Allowed' : 'Prohibited'}</li>
              <li>Direct Buyer-Farmer Chat: {SYSTEM_RULES.BUYER_FARMER_CHAT_ENABLED ? 'Allowed' : 'Prohibited'}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Batch Lifecycle</h2>
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 text-center">
              <div className="p-2 bg-gray-100 rounded border">{BATCH_STATUS.DRAFT}</div>
              <div className="p-2 bg-green-100 rounded border border-green-200 text-green-800">{BATCH_STATUS.OPEN}</div>
              <div className="p-2 bg-red-100 rounded border border-red-200 text-red-800">{BATCH_STATUS.CLOSED}</div>
              <div className="p-2 bg-yellow-100 rounded border border-yellow-200 text-yellow-800">{BATCH_STATUS.COLLECTED}</div>
              <div className="p-2 bg-blue-100 rounded border border-blue-200 text-blue-800">{BATCH_STATUS.DELIVERED}</div>
              <div className="p-2 bg-purple-100 rounded border border-purple-200 text-purple-800">{BATCH_STATUS.SETTLED}</div>
            </div>
          </div>
        </section>

        <footer className="mt-8 pt-4 border-t text-sm text-gray-400">
          Mobile-responsive • Admin-first • Secure
        </footer>
      </div>
    </div>
  )
}

export default App
