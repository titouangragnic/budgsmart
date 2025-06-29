import { useAuth } from '../../contexts/AuthContext';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    return user.email;
  };

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.firstName) {
      return user.firstName[0].toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/budgsmart/login';
  };

  return (
    <div className={styles.userProfile}>
      <div className={styles.profileInfo}>
        <div className={styles.avatar}>
          {getInitials()}
        </div>
        <div className={styles.userDetails}>
          <span className={styles.userName}>{getDisplayName()}</span>
          <span className={styles.userEmail}>{user.email}</span>
        </div>
      </div>
      <button 
        onClick={handleLogout}
        className={styles.logoutButton}
        title="Se déconnecter"
      >
        Déconnexion
      </button>
    </div>
  );
};

export default UserProfile;
