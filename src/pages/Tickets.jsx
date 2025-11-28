import { useEffect, useState } from 'react';
import { ticketsAPI } from '../services/api';

const Tickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
    });

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const response = await ticketsAPI.getAll();
            setTickets(response.data.tickets || []);
        } catch (error) {
            console.error('Failed to load tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ticketsAPI.create(formData);
            setFormData({ title: '', description: '', priority: 'MEDIUM' });
            setShowForm(false);
            loadTickets();
        } catch (error) {
            console.error('Failed to create ticket:', error);
            alert('Failed to create ticket');
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading tickets...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Support Tickets</h1>
                <button onClick={() => setShowForm(!showForm)} style={styles.button}>
                    {showForm ? 'Cancel' : '+ New Ticket'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            style={styles.input}
                            placeholder="Brief description of your issue"
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows="5"
                            style={styles.textarea}
                            placeholder="Provide detailed information about your issue"
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Priority</label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            style={styles.select}
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                        </select>
                    </div>

                    <button type="submit" style={styles.submitButton}>
                        Create Ticket
                    </button>
                </form>
            )}

            <div style={styles.ticketsList}>
                {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                        <div key={ticket.id} style={styles.ticketCard}>
                            <div style={styles.ticketHeader}>
                                <h3 style={styles.ticketTitle}>{ticket.title}</h3>
                                <span style={{ ...styles.badge, ...getPriorityStyle(ticket.priority) }}>
                                    {ticket.priority}
                                </span>
                            </div>
                            <p style={styles.ticketDescription}>{ticket.description}</p>
                            <div style={styles.ticketFooter}>
                                <span style={{ ...styles.status, ...getStatusStyle(ticket.status) }}>
                                    {ticket.status}
                                </span>
                                <span style={styles.date}>
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={styles.emptyState}>
                        <p>No tickets yet. Create your first ticket!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const getPriorityStyle = (priority) => {
    const colors = {
        LOW: { backgroundColor: '#e3f2fd', color: '#1976d2' },
        MEDIUM: { backgroundColor: '#fff3e0', color: '#f57c00' },
        HIGH: { backgroundColor: '#fce4ec', color: '#c2185b' },
        URGENT: { backgroundColor: '#ffebee', color: '#d32f2f' },
    };
    return colors[priority] || colors.MEDIUM;
};

const getStatusStyle = (status) => {
    const colors = {
        OPEN: { backgroundColor: '#e8f5e9', color: '#388e3c' },
        IN_PROGRESS: { backgroundColor: '#fff3e0', color: '#f57c00' },
        RESOLVED: { backgroundColor: '#e3f2fd', color: '#1976d2' },
        CLOSED: { backgroundColor: '#f5f5f5', color: '#757575' },
    };
    return colors[status] || colors.OPEN;
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
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    title: {
        color: '#1a1a2e',
    },
    button: {
        backgroundColor: '#0066ff',
        color: '#fff',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    form: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
    },
    field: {
        marginBottom: '1.5rem',
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: '500',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '1rem',
    },
    textarea: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '1rem',
        fontFamily: 'inherit',
    },
    select: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '1rem',
    },
    submitButton: {
        backgroundColor: '#0066ff',
        color: '#fff',
        border: 'none',
        padding: '1rem 2rem',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '500',
    },
    ticketsList: {
        display: 'grid',
        gap: '1.5rem',
    },
    ticketCard: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    ticketHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '1rem',
    },
    ticketTitle: {
        color: '#333',
        margin: 0,
    },
    badge: {
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    ticketDescription: {
        color: '#666',
        marginBottom: '1rem',
    },
    ticketFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    status: {
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    date: {
        color: '#999',
        fontSize: '0.9rem',
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem',
        color: '#999',
    },
};

export default Tickets;