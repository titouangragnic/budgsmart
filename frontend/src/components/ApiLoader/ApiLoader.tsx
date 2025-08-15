import { useApiStatus } from '../../hooks/useApiStatus';
import styles from './ApiLoader.module.css';

interface ApiLoaderProps {
  children: React.ReactNode;
}

const ApiLoader: React.FC<ApiLoaderProps> = ({ children }) => {
  const { isLoading, error, retryCount } = useApiStatus();
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Service temporairement indisponible</h2>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    const progress = Math.min((retryCount / 20) * 100, 100);
    const estimatedTime = Math.max(60 - (retryCount * 3), 0);

    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingCard}>
          <div className={styles.logoContainer}>
            <h1 className={styles.logo}>💰 BudgSmart</h1>
          </div>
          
          <div className={styles.loadingContent}>
            <div className={styles.spinner}></div>
            <h2>Démarrage de l'application</h2>
            <p>
              L'application se met en marche, cela peut prendre jusqu'à 1 minute...
            </p>
            
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className={styles.progressText}>
                Tentative {retryCount + 1}/20
              </span>
            </div>

            {estimatedTime > 0 && (
              <p className={styles.estimatedTime}>
                Temps estimé restant : ~{estimatedTime} secondes
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ApiLoader;
