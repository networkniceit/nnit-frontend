import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscriptionAPI, ticketsAPI } from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [subRes, ticketsRes] = await Promise.all([
                subscriptionAPI.getCurrentSubscription(),
                ticketsAPI.getAll({ limit: 5 }),
            ]);
            setSubscription(subRes.data.subscription);
            setTickets(ticketsRes.data.tickets || []);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome, {user?.name}!</h1>

            <div style={styles.grid}>
                {/* Subscription Card */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Your Subscription</h2>
                    <div style={styles.planBadge}>
                        {subscription?.subscriptionPlan?.toUpperCase() || 'FREE'}
                    </div>
                    <p style={styles.status}>
                        Status: {subscription?.subscriptionStatus || 'active'}
                    </p>
                    <Link to="/pricing">
                        <button style={styles.button}>
                            {subscription?.subscriptionPlan === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                        </button>
                    </Link>
                </div>

                {/* Recent Tickets Card */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Recent Tickets</h2>
                    {tickets.length > 0 ? (
                        <ul style={styles.ticketList}>
                            {tickets.map((ticket) => (
                                <li key={ticket.id} style={styles.ticketItem}>
                                    <span>{ticket.title}</span>
                                    <span style={styles.ticketStatus}>{ticket.status}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={styles.emptyState}>No tickets yet</p>
                    )}
                    <Link to="/tickets">
                        <button style={styles.button}>View All Tickets</button>
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.actions}>
                <h2 style={styles.sectionTitle}>Quick Actions</h2>
                <div style={styles.actionGrid}>
                    <Link to="/tickets" style={styles.actionCard}>
                        <h3>Create Ticket</h3>
                        <p>Submit a new support request</p>
                    </Link>
                    <Link to="/pricing" style={styles.actionCard}>
                        <h3>Upgrade</h3>
                        <p>Get more features with Pro or Business</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
    },
    loading: {
        textAlign: 'center',
        padding: '3rem',
        fontSize: '1.2rem',
    },
    title: {
        marginBottom: '2rem',
        color: '#1a1a2e',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem',
    },
    card: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    cardTitle: {
        marginBottom: '1rem',
        color: '#333',
    },
    planBadge: {
        display: 'inline-block',
        backgroundColor: '#0066ff',
        color: '#fff',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
    },
    status: {
        color: '#666',
        marginBottom: '1rem',
    },
    button: {
        backgroundColor: '#0066ff',
        color: '#fff',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        width: '100%',
    },
    ticketList: {
        listStyle: 'none',
        padding: 0,
        marginBottom: '1rem',
    },
    ticketItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.75rem 0',
        borderBottom: '1px solid #eee',
    },
    ticketStatus: {
        color: '#666',
        fontSize: '0.9rem',
    },
    emptyState: {
        color: '#999',
        textAlign: 'center',
        padding: '2rem 0',
    },
    actions: {
        marginTop: '3rem',
    },
    sectionTitle: {
        marginBottom: '1.5rem',
        color: '#333',
    },
    actionGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
    },
    actionCard: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textDecoration: 'none',
        color: '#333',
        transition: 'transform 0.2s',
        cursor: 'pointer',
    },
};

export default Dashboard;