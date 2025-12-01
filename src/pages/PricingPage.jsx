import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCheck, FiShield, FiCheckCircle, FiUsers, FiAward, FiArrowRight
} from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 py-32 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
          <motion.div
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl"
            animate={{
              x: [0, 120, 0],
              y: [0, -60, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        <div className="container-modern relative z-10">
        <div className="container-modern">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 text-white px-6 py-3 mb-6 shadow-lg shadow-blue-500/50 border border-white/20">
              <FiAward className="w-5 h-5 inline mr-2" />
              Simple, Transparent Pricing
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8">
              Choose the <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">Perfect Plan</span> for Your Team
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-4">
              Start with a 1day free trial. No credit card required. Cancel anytime.
            </p>
            <p className="text-lg text-white/80">
              All plans include core ATS features. Scale as you grow.
            </p>
          </motion.div>
        </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-modern">
        <div className="container-modern">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Starter Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card variant="default" className="h-full">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                    <p className="text-gray-600 text-sm">Perfect for small teams</p>
                  </div>
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-gray-900">$99</div>
                    <div className="text-gray-500 text-sm">/month</div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Up to 50 candidates/month',
                      'AI Resume Parsing',
                      'Basic Analytics',
                      '5 Assessment Templates',
                      'Email Support'
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800 font-semibold">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="w-full">
                    <Button variant="outline" size="lg" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Professional Plan - Popular */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card variant="gradient" className="h-full border-2 border-primary-500 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="default" className="bg-primary-gradient text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                    <p className="text-gray-600 text-sm">For growing companies</p>
                  </div>
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-gray-900">$299</div>
                    <div className="text-gray-500 text-sm">/month</div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Up to 200 candidates/month',
                      'AI Resume + JD Matching',
                      'Advanced Analytics',
                      'Unlimited Assessments',
                      'Interview Scheduling',
                      'Document Verification',
                      'Priority Support'
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800 font-semibold">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="w-full">
                    <Button variant="default" size="lg" className="w-full">
                      Start Free Trial
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card variant="default" className="h-full">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                    <p className="text-gray-600 text-sm">Custom solutions at scale</p>
                  </div>
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-gray-900">Custom</div>
                    <div className="text-gray-500 text-sm">Contact us for pricing</div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Unlimited candidates',
                      'Custom AI Training',
                      'White-label Solution',
                      'API Access',
                      'Dedicated Account Manager',
                      'SLA Guarantee',
                      '24/7 Premium Support'
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800 font-semibold">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://cognitbotz.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="outline" size="lg" className="w-full">
                      Contact Sales
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Trust Badge */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FiShield className="w-4 h-4 text-green-500" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4 text-green-500" />
                <span>14-Day Free Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-green-500" />
                <span>No Credit Card Required</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-modern bg-white">
        <div className="container-modern max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'Can I change plans later?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
              },
              {
                q: 'What happens after the free trial?',
                a: 'After 1 day, you can choose a paid plan or continue with limited free features. No auto-charges.'
              },
             
              {
                q: 'Is there a setup fee?',
                a: 'No setup fees. Get started immediately with our intuitive onboarding process.'
              }
            ].map((faq, index) => (
              <Card key={index} variant="default" className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-modern bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600">
        <div className="container-modern text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Start Your Free Trial Today
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              No credit card required. Full access to all features for 14 days.
            </p>
            <Link to="/register">
              <Button variant="default" size="xl" className="bg-white text-primary-600">
                Get Started Now
                <FiArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
