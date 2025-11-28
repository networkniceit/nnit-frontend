import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <Link to="/" style={styles.logo}>
                    NNIT Support
                </Link>

                <div style={styles.links}>
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" style={styles.link}>
                                Dashboard
                            </Link>
                            <Link to="/tickets" style={styles.link}>
                                Tickets
                            </Link>
                            <Link to="/pricing" style={styles.link}>
                                Pricing
                            </Link>
                            <span style={styles.userInfo}>
                                {user?.name} ({user?.subscriptionPlan || 'free'})
                            </span>
                            <button onClick={handleLogout} style={styles.button}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/pricing" style={styles.link}>
                                Pricing
                            </Link>
                            <Link to="/login" style={styles.link}>
                                Login
                            </Link>
                            <Link to="/register">
                                <button style={styles.button}>Sign Up</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        backgroundColor: '#1a1a2e',
        padding: '1rem 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        color: '#fff',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textDecoration: 'none',
    },
    links: {
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '1rem',
    },
    userInfo: {
        color: '#aaa',
        fontSize: '0.9rem',
    },
    button: {
        backgroundColor: '#0066ff',
        color: '#fff',
        border: 'none',
        padding: '0.5rem 1.5rem',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
};

export default Navbar;