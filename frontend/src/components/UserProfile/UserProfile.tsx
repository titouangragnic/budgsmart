import { useAuth } from '../../contexts/AuthContext';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const getDisplayName = () => {
    if (user.name) {
      return user.name;
    }
    if (user.nickname) {
      return user.nickname;
    }
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    return user.email;
  };

  const getInitials = () => {
    const displayName = getDisplayName();
    const nameParts = displayName.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return displayName[0].toUpperCase();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.userProfile}>
      <div className={styles.profileInfo}>
        <div className={styles.avatar}>
          {user.picture ? (
            <img src={user.picture} alt="Profile" className={styles.avatarImage} />
          ) : (
            getInitials()
          )}
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
