$content = @"
import { useEffect, useState } from 'react';
import { subscriptionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await subscriptionAPI.getPlans();
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Failed to load plans:', error);
    }
  };

  const handleSubscribe = async (plan) => {
    if (!isAuthenticated) {
      alert('Please login to subscribe');
      return;
    }

    if (plan.id === 'free') {
      alert('You are already on the free plan!');
      return;
    }

    setLoading(true);
    try {
      const response = await subscriptionAPI.createCheckout({
        priceId: plan.stripePriceId,
        planName: plan.id,
      });

      console.log('About to redirect to:', response.data.url);
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' },
    header: { textAlign: 'center', marginBottom: '4rem' },
    title: { fontSize: '3rem', marginBottom: '1rem', color: '#1a1a2e' },
    subtitle: { fontSize: '1.2rem', color: '#666' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' },
    card: { backgroundColor: '#fff', padding: '2.5rem', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', position: 'relative' },
    featured: { border: '3px solid #0066ff', transform: 'scale(1.05)' },
    badge: { position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0066ff', color: '#fff', padding: '0.5rem 1.5rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' },
    planName: { fontSize: '2rem', marginBottom: '1rem', color: '#333' },
    price: { marginBottom: '2rem' },
    priceAmount: { fontSize: '3rem', fontWeight: 'bold', color: '#0066ff' },
    pricePeriod: { fontSize: '1rem', color: '#666' },
    features: { listStyle: 'none', padding: 0, marginBottom: '2rem' },
    feature: { padding: '0.75rem 0', color: '#666' },
    button: { width: '100%', padding: '1rem', border: '2px solid #0066ff', backgroundColor: '#fff', color: '#0066ff', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' },
    buttonPrimary: { backgroundColor: '#0066ff', color: '#fff' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Choose Your Plan</h1>
        <p style={styles.subtitle}>Start free, upgrade when you need more power</p>
      </div>
      <div style={styles.grid}>
        {plans.map((plan) => (
          <div key={plan.id} style={{ ...styles.card, ...(plan.id === 'pro' ? styles.featured : {}) }}>
            {plan.id === 'pro' && <div style={styles.badge}>POPULAR</div>}
            <h2 style={styles.planName}>{plan.name}</h2>
            <div style={styles.price}>
              <span style={styles.priceAmount}>\`$\`{(plan.price / 100).toFixed(2)}</span>
              <span style={styles.pricePeriod}>/month</span>
            </div>
            <ul style={styles.features}>
              {plan.features.map((feature, index) => (
                <li key={index} style={styles.feature}>✓ {feature}</li>
              ))}
            </ul>
            <button onClick={() => handleSubscribe(plan)} disabled={loading || user?.subscriptionPlan === plan.id} style={{ ...styles.button, ...(plan.id === 'pro' ? styles.buttonPrimary : {}) }}>
              {user?.subscriptionPlan === plan.id ? 'Current Plan' : plan.id === 'free' ? 'Get Started' : 'Subscribe Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
"@

Set-Content -Path ".\src\pages\Pricing.jsx" -Value $content
Write-Host "Pricing.jsx created successfully!"