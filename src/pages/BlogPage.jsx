import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiFileText, FiClock, FiArrowRight, FiCpu, FiUsers, FiTrendingUp,
  FiBarChart2, FiShield, FiVideo
} from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const BlogPage = () => {
 const posts = [
  {
    category: 'AI in Recruitment',
    title: 'How AI is Redefining End-to-End Hiring in 2025',
    excerpt: 'From JD validation to offer letter generation, AI is transforming every stage of recruitment. Here’s how modern ATS systems accelerate hiring cycles.',
    readTime: '5 min read',
    date: 'Nov 15, 2024',
    icon: FiCpu
  },
  {
    category: 'Hiring Best Practices',
    title: 'Designing a Seamless Candidate Experience in a Digital-First Hiring World',
    excerpt: 'A smooth candidate journey is now a competitive advantage. Learn practical ways to reduce friction and boost engagement throughout your hiring process.',
    readTime: '7 min read',
    date: 'Nov 10, 2024',
    icon: FiUsers
  },
  {
    category: 'Customer Stories',
    title: 'How a Fast-Growing IT Firm Cut Screening Time by 60% with SkillMatrix',
    excerpt: 'A real case study showing how SkillMatrix automated bulk resume screening, assessments, and interview scheduling for a scaling enterprise.',
    readTime: '8 min read',
    date: 'Nov 5, 2024',
    icon: FiTrendingUp
  },
  {
    category: 'Product Deep Dive',
    title: 'Introducing SkillMatrix Assessment Engine: MCQ, Text, Voice & Video AI Scoring',
    excerpt: 'Explore how our assessment module evaluates every response using multi-layer AI scoring for smarter, more objective talent decisions.',
    readTime: '4 min read',
    date: 'Oct 28, 2024',
    icon: FiBarChart2
  },
  {
    category: 'Data Security',
    title: 'Recruitment Data Compliance: A Practical Guide for HR Teams',
    excerpt: 'Understand consent workflows, secure document handling, and data protection practices required for modern hiring environments.',
    readTime: '10 min read',
    date: 'Oct 20, 2024',
    icon: FiShield
  },
  {
    category: 'Interview Intelligence',
    title: 'Optimizing Video Interviews: Proven Techniques for HR & Hiring Managers',
    excerpt: 'Discover professional tips to structure, conduct, and evaluate video interviews efficiently in a hybrid-work era.',
    readTime: '6 min read',
    date: 'Oct 15, 2024',
    icon: FiVideo
  }
];


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
              <FiFileText className="w-5 h-5 inline mr-2" />
              Resources & Insights
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8">
              Latest from <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">Our Blog</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Expert insights, best practices, and trends in AI-powered recruitment
            </p>
          </motion.div>
        </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-modern">
        <div className="container-modern">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card variant="default" className="h-full group hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    {/* Icon & Category */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                          <post.icon className="w-5 h-5 text-primary-600" />
                        </div>
                        <Badge variant="outline" size="sm">{post.category}</Badge>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3 font-semibold">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <FiClock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                      <span>{post.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* View All CTA */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <a href="https://cognitbotz.com/blog" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                View All Articles
                <FiArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="section-modern bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600">
        <div className="container-modern text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Get the latest recruitment insights delivered to your inbox weekly
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-3 rounded-lg text-gray-900 flex-1 max-w-md"
              />
              <Button variant="default" size="lg" className="bg-white text-primary-600">
                Subscribe
                <FiArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
