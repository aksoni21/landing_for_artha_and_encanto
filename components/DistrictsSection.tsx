import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DistrictsSection() {
  return (
    <section className="container mx-auto px-6 py-20 bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            FOR DISTRICT ADMINISTRATORS
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Title III Compliance & District-Wide Analytics
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Comprehensive ELL program monitoring, AMAO tracking, and data-driven insights across your entire district
          </p>
        </div>

        {/* Key District Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: '📊',
              title: 'Real-Time Compliance Tracking',
              description: 'Monitor AMAO 1, 2, and 3 progress across all schools with automated reporting',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: '🏫',
              title: 'Multi-School Dashboard',
              description: 'View proficiency rates, engagement scores, and student outcomes by school site',
              color: 'from-purple-500 to-pink-500'
            },
            {
              icon: '📈',
              title: 'Data-Driven Decisions',
              description: 'Identify high-performing schools and target intervention resources where needed',
              color: 'from-green-500 to-emerald-500'
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`bg-gradient-to-r ${benefit.color} p-6`}>
                <div className="text-5xl mb-2">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-white">{benefit.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 text-lg">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Demo Dashboard Preview */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8">
            <h3 className="text-3xl font-bold text-white mb-2">District Dashboard Preview</h3>
            <p className="text-blue-100">See exactly what district administrators can track</p>
          </div>

          <div className="p-8">
            {/* Key Metrics Grid */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                <p className="text-3xl font-bold text-blue-600">2,847</p>
                <p className="text-sm text-gray-600">Total ELL Students</p>
                <p className="text-xs text-green-600 mt-1">+3.2% from last year</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                <p className="text-3xl font-bold text-green-600">18.4%</p>
                <p className="text-sm text-gray-600">Proficiency Rate</p>
                <p className="text-xs text-green-600 mt-1">Above 15.2% target</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
                <p className="text-3xl font-bold text-purple-600">46k</p>
                <p className="text-sm text-gray-600">Weekly AI Minutes</p>
                <p className="text-xs text-green-600 mt-1">+45% this quarter</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 text-center border border-amber-200">
                <p className="text-3xl font-bold text-amber-600">+23.7%</p>
                <p className="text-sm text-gray-600">Vocabulary Growth</p>
                <p className="text-xs text-green-600 mt-1">Above expectations</p>
              </div>
            </div>

            {/* AMAO Compliance Status */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
              <div className="flex items-center mb-4">
                <span className="text-green-500 text-3xl mr-3">✓</span>
                <h4 className="text-xl font-bold text-gray-900">Title III Compliance: MEETING ALL TARGETS</h4>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-300">
                  <p className="text-sm text-gray-600 mb-1">AMAO 1: Progress</p>
                  <p className="font-bold text-gray-900">72.3% <span className="text-green-600 text-sm">(Target: 65%)</span></p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-300">
                  <p className="text-sm text-gray-600 mb-1">AMAO 2: Proficiency</p>
                  <p className="font-bold text-gray-900">18.4% <span className="text-green-600 text-sm">(Target: 15.2%)</span></p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-300">
                  <p className="text-sm text-gray-600 mb-1">AMAO 3: Math Achievement</p>
                  <p className="font-bold text-gray-900">48.1% <span className="text-green-600 text-sm">(Target: 45%)</span></p>
                </div>
              </div>
            </div>

            {/* School Performance Table */}
            <div className="overflow-x-auto mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">School Performance Overview</h4>
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">School</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ELL Students</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proficiency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { name: 'Roosevelt Elementary', ells: 245, proficiency: 22.1, status: 'exceeding', color: 'green' },
                    { name: 'Lincoln Middle', ells: 198, proficiency: 16.8, status: 'meeting', color: 'yellow' },
                    { name: 'Washington High', ells: 156, proficiency: 12.3, status: 'below', color: 'red' },
                    { name: 'Jefferson Elementary', ells: 301, proficiency: 19.7, status: 'meeting', color: 'yellow' },
                  ].map((school, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{school.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{school.ells}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{school.proficiency}%</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          school.color === 'green' ? 'bg-green-100 text-green-800' :
                          school.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {school.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Link
                href="/title3/dashboard"
                className="inline-block bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                View Full District Dashboard Demo
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Why Districts Choose Encanto AI */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why District Administrators Choose Encanto AI
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Automated Compliance Reporting',
                description: 'Generate Title III reports with real-time data instead of manual data collection',
                icon: '📋'
              },
              {
                title: 'Identify Intervention Needs',
                description: 'Spot schools and students falling behind before they become at-risk',
                icon: '🎯'
              },
              {
                title: 'Resource Allocation Insights',
                description: 'See which schools need additional support and where to invest resources',
                icon: '💡'
              },
              {
                title: 'Engagement Analytics',
                description: 'Track speaking practice time, vocabulary growth, and authentic language use across the district',
                icon: '⚡'
              },
              {
                title: 'Multi-Level Access',
                description: 'District admins, principals, and teachers all get relevant views of the same data',
                icon: '👥'
              },
              {
                title: 'FERPA & Privacy Compliant',
                description: 'Secure, encrypted data storage with role-based access controls',
                icon: '🔒'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-3xl">{feature.icon}</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-700">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div> */}

        {/* District Demo CTA */}
        <motion.div
          className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl shadow-2xl p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your District&apos;s ELL Program?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Schedule a personalized demo to see how Encanto AI can help you meet Title III compliance goals
            while improving student outcomes across all your schools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
              href="/title3/dashboard"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              View Live Dashboard
            </Link>
            <button
              onClick={() => document.getElementById('institutional-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Schedule District Demo
            </button>

          </div>
          <p className="text-sm text-blue-200 mt-6">
            Join districts using AI to improve ELL outcomes and simplify compliance reporting
          </p>
        </motion.div>
      </div>
    </section>
  );
}
