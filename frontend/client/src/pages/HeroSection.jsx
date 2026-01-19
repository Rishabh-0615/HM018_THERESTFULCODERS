import { Package, Pill, Truck, BarChart3, Clock, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function PharmaCare() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">NexPharma</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#solutions" className="text-slate-600 hover:text-slate-900 transition-colors">
              Solutions
            </a>
            <a href="#benefits" className="text-slate-600 hover:text-slate-900 transition-colors">
              Benefits
            </a>
            <a href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-blue-100 rounded-full">
                <span className="text-sm font-medium text-blue-600">Revolutionizing Pharmacy Management</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900">
                Your Digital Pharmacy <span className="text-blue-600">Transformation</span>
              </h1>
              <p className="text-xl text-slate-600">
                Streamline medicine management, optimize orders, and deliver excellence. One unified platform for
                pharmacists and customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-lg rounded-lg transition-colors"
                >
                  Start as Pharmacist
                </button>
                <button 
                  onClick={() => navigate('/dhruv/register')}
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 h-12 px-8 text-lg rounded-lg bg-transparent transition-colors"
                >
                  Start as Customer
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8 border border-blue-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg border border-slate-200">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Pill className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Real-time Inventory</p>
                      <p className="text-sm text-slate-600">Always in sync</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg border border-slate-200">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Smart Delivery</p>
                      <p className="text-sm text-slate-600">Live tracking</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg border border-slate-200">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Prescription Safe</p>
                      <p className="text-sm text-slate-600">Secure uploads</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Powerful Features</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to revolutionize your pharmacy operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Stock Management</h3>
              <p className="text-slate-600">
                Digital inventory tracking with automated alerts for low stock levels. Never run out of critical
                medicines.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Order Management</h3>
              <p className="text-slate-600">
                Streamlined ordering system for customers with prescription uploads and quick refill options.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Live Delivery Tracking</h3>
              <p className="text-slate-600">
                Real-time tracking for both customers and pharmacists. Know exactly where your order is.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Secure Prescriptions</h3>
              <p className="text-slate-600">
                HIPAA-compliant prescription uploads with verification and secure storage.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Smart Alerts</h3>
              <p className="text-slate-600">
                Automated notifications for low inventory, order updates, and refill reminders.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Pill className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Medicine Search</h3>
              <p className="text-slate-600">
                Advanced search with filters, dosage info, availability, and price comparison.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-4">For Pharmacists</h2>
                <p className="text-lg text-slate-600">
                  Take control of your pharmacy operations with intelligent tools designed for efficiency.
                </p>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Digital Operations</h4>
                    <p className="text-sm text-slate-600">Manage all operations from one dashboard</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Inventory Insights</h4>
                    <p className="text-sm text-slate-600">Predictive analytics for stock optimization</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Order Visibility</h4>
                    <p className="text-sm text-slate-600">Track all customer orders and deliveries</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8 border border-blue-200 h-96"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mt-20">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8 border border-blue-200 h-96"></div>
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-4">For Customers</h2>
                <p className="text-lg text-slate-600">
                  Experience convenience and reliability in your pharmacy interactions.
                </p>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Easy Search</h4>
                    <p className="text-sm text-slate-600">Find medicines in seconds with advanced filters</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Quick Orders</h4>
                    <p className="text-sm text-slate-600">One-click ordering and automatic refills</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Live Tracking</h4>
                    <p className="text-sm text-slate-600">Know exactly when your order arrives</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Proven Results</h2>
            <p className="text-xl text-slate-600">Join hundreds of pharmacies transforming their operations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">85%</div>
              <p className="text-lg text-slate-700">Faster Order Processing</p>
            </div>
            <div className="text-center p-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">40%</div>
              <p className="text-lg text-slate-700">Reduction in Inventory Costs</p>
            </div>
            <div className="text-center p-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">99%</div>
              <p className="text-lg text-slate-700">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 to-blue-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Ready to Transform Your Pharmacy?</h2>
            <p className="text-xl text-slate-600">
              Join the digital revolution and streamline your operations today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-lg rounded-lg transition-colors">
              Get Started Free
            </button>
            <button className="border border-slate-300 hover:border-slate-400 h-12 px-8 text-lg bg-transparent rounded-lg transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <Pill className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-slate-900">PharmaCare</span>
              </div>
              <p className="text-sm text-slate-600">Transforming pharmacy management for the digital age.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-slate-900 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-slate-900 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-slate-900 transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 transition-colors">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>&copy; 2026 PharmaCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}