import FeatureCard from "../components/FeaturesCard";
import { QrCode, Recycle, Trophy, Leaf, ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-white">

            <main className="w-full mx-auto">
                <section className="w-full px-40 py-20 ">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* LEFT */}
                        <div>
                            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm mb-4">
                                <Leaf className="w-4 h-4" />
                                Eco-Friendly Waste Management
                            </span>

                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                                Smart Bin Waste <br /> Management System
                            </h1>

                            <p className="text-gray-600 max-w-xl mb-8">
                                Join our community in responsible waste segregation and earn
                                rewards for being environmentally conscious. Together, we can
                                make our barangay cleaner and greener.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                                    Register Household
                                    <ArrowRight className="w-5 h-5" />
                                </button>

                                <button className="border cursor-pointer border-green-600 text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50">
                                    Login
                                </button>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex justify-center lg:justify-end">
                            <FeatureCard />
                        </div>


                    </div>
                </section>

                <section className="w-full">
                    {/* FEATURES */}
                    <div className="max-w-7xl mx-auto px-4 py-20">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-green-50 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition">
                                <div className="w-14 h-14 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <QrCode className="text-white" size={28} />
                                </div>

                                <h3 className="text-lg font-semibold mb-2">Scan Qr Code</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Each household gets a unique QR code for tracking waste disposal
                                </p>
                            </div>

                            <div className="bg-green-50 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition">
                                <div className="w-14 h-14 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <Recycle className="text-white" size={28} />
                                </div>

                                <h3 className="text-lg font-semibold mb-2">Segregate Waste</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Properly sort waste into biodegradable, non-biodegradable, and recyclable
                                </p>
                            </div>

                            <div className="bg-green-50 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition">
                                <div className="w-14 h-14 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <Trophy className="text-white" size={28} />
                                </div>

                                <h3 className="text-lg font-semibold mb-2">Rewards</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Get points for compliance and redeem for eco-friendly items
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="w-full bg-green-600 text-white">
                        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to make a difference?
                            </h2>

                            <p className="text-green-100 mb-8">
                                Join hundreds of households in our community
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="bg-white cursor-pointer text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition">
                                    Register Now
                                </button>

                                <button className="bg-green-700 cursor-pointer px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition">
                                    Admin Login
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
