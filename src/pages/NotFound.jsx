import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="notfound">
      <Compass style={{ width: 40, height: 40, color: 'var(--color-text-faint)' }} />
      <div className="notfound-code">404</div>
      <h1 style={{ fontSize: 'var(--text-xl)' }}>This page wandered off your balance sheet</h1>
      <p className="text-muted" style={{ maxWidth: 380 }}>
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved. Let&rsquo;s get you back
        to your finances.
      </p>
      <Link to="/dashboard">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}
