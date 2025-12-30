import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 text-sm">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-2">GRAMS</h3>
          <p>Grievance Redressal And Monitoring System</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-2">Quick Links</h4>
          <ul className="space-y-1">
            <li>
              <Link to="/" className="hover:text-white">Home</Link>
            </li>
            <li>
              <Link to="/transparency" className="hover:text-white">Transparency</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white">Login</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-2">Legal</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Use</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-2">Support</h4>
          <ul className="space-y-1">
            <li>Email: info@grams.gov</li>
            <li>Phone: +91-7343-212345</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
