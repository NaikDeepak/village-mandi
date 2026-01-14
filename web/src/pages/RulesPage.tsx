import { Link } from 'react-router-dom';
import { Clock, CreditCard, Truck, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { SYSTEM_RULES, BATCH_STATUS } from '@shared/constants';

const batchStates = [
    { status: BATCH_STATUS.DRAFT, description: 'Admin prepares the batch, sets pricing and products.' },
    { status: BATCH_STATUS.OPEN, description: 'Buyers can place orders. Prices are locked.' },
    { status: BATCH_STATUS.CLOSED, description: 'Cutoff reached. No new orders or edits allowed.' },
    { status: BATCH_STATUS.COLLECTED, description: 'Goods procured from farmers.' },
    { status: BATCH_STATUS.DELIVERED, description: 'Orders distributed to buyers.' },
    { status: BATCH_STATUS.SETTLED, description: 'All payments complete. Farmers paid out.' },
];

export function RulesPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar variant="internal" />
            <main className="pt-20">
                {/* Page Header */}
                <section className="bg-mandi-cream py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-mandi-dark mb-4">
                            How Virtual Mandi Works
                        </h1>
                        <p className="text-lg text-mandi-muted">
                            Clear rules ensure fairness for everyone. Read these before placing your first order.
                        </p>
                    </div>
                </section>

                {/* Batch Lifecycle */}
                <section className="py-16 border-b border-gray-100">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="h-6 w-6 text-mandi-green" />
                            <h2 className="text-2xl font-bold text-mandi-dark">Batch Lifecycle</h2>
                        </div>
                        <p className="text-mandi-muted mb-8">
                            We operate in cycles called "Batches." Each batch moves through these states in order:
                        </p>
                        <div className="space-y-4">
                            {batchStates.map((state, index) => (
                                <div key={state.status} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-mandi-green text-white flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-mandi-dark">{state.status}</div>
                                        <div className="text-mandi-muted">{state.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Cutoff Enforcement */}
                <section className="py-16 border-b border-gray-100">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertCircle className="h-6 w-6 text-mandi-green" />
                            <h2 className="text-2xl font-bold text-mandi-dark">Cutoff Enforcement</h2>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                            <p className="text-red-800 font-medium">
                                Once a batch reaches its cutoff time, it is permanently locked.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <span className="text-mandi-muted">No new orders can be placed after cutoff</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <span className="text-mandi-muted">No edits to existing orders after cutoff</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <span className="text-mandi-muted">No product substitutions once locked</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <span className="text-mandi-muted">Batches cannot be reopened once closed</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Two-Stage Payments */}
                <section className="py-16 border-b border-gray-100">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-6">
                            <CreditCard className="h-6 w-6 text-mandi-green" />
                            <h2 className="text-2xl font-bold text-mandi-dark">Two-Stage Payment System</h2>
                        </div>
                        <p className="text-mandi-muted mb-8">
                            Payments are split into two stages to ensure commitment from buyers and fair settlement for farmers.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Stage 1 */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <div className="text-sm font-medium text-mandi-green uppercase tracking-wide mb-2">Stage 1</div>
                                <h3 className="text-xl font-bold text-mandi-dark mb-3">Commitment Fee ({SYSTEM_RULES.FACILITATION_FEE_PERCENTAGE}%)</h3>
                                <ul className="space-y-2 text-mandi-muted">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                                        <span>Paid when you place your order</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                                        <span>Confirms your commitment to the batch</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                                        <span>Paid via manual UPI transfer</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Stage 2 */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <div className="text-sm font-medium text-mandi-green uppercase tracking-wide mb-2">Stage 2</div>
                                <h3 className="text-xl font-bold text-mandi-dark mb-3">Final Settlement (90%)</h3>
                                <ul className="space-y-2 text-mandi-muted">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                                        <span>Paid after procurement is complete</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                                        <span>Includes delivery charges if applicable</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                                        <span>Required before pickup/delivery</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800 text-sm">
                                <strong>Note:</strong> All payments are manual UPI transfers. We do not auto-settle or process automated refunds.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Fulfilment */}
                <section className="py-16 border-b border-gray-100">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Truck className="h-6 w-6 text-mandi-green" />
                            <h2 className="text-2xl font-bold text-mandi-dark">Fulfilment Options</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            {/* Pickup */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-mandi-dark mb-3">Pickup (Default)</h3>
                                <ul className="space-y-2 text-mandi-muted">
                                    <li>• Collect from designated hub location</li>
                                    <li>• No additional charges</li>
                                    <li>• Pickup window communicated after settlement</li>
                                </ul>
                            </div>

                            {/* Delivery */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-mandi-dark mb-3">Delivery (Optional)</h3>
                                <ul className="space-y-2 text-mandi-muted">
                                    <li>• Delivered to your address</li>
                                    <li>• Additional delivery charges apply</li>
                                    <li>• Available in select areas only</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <p className="text-mandi-muted text-sm">
                                <strong>Important:</strong> Fulfilment type cannot be changed after the batch cutoff. Choose carefully when placing your order.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Farmer Policy */}
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-mandi-dark mb-6">Farmer Policy</h2>
                        <div className="space-y-4 text-mandi-muted">
                            <p>
                                Every product on Virtual Mandi is linked to a specific farmer. We share their name, location, and story with you.
                            </p>
                            <p>
                                To maintain operational efficiency and prevent miscommunication, we do not facilitate direct buyer-farmer communication. All coordination happens through Virtual Mandi.
                            </p>
                            <p>
                                Farmers are paid out after each batch is settled. Payout records are maintained for full transparency.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-mandi-cream">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-2xl font-bold text-mandi-dark mb-4">Ready to Order?</h2>
                        <p className="text-mandi-muted mb-6">
                            Join as a buyer to participate in the next batch.
                        </p>
                        <Link to="/login">
                            <Button size="lg">
                                Join as Buyer
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
