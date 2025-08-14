import styles from "../styles/SkeletonLoader.module.scss"

export function SkeletonLoader() {
  return (
    <div className={styles.skeletonContainer}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonImage}></div>
          <div className={styles.skeletonText}>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
          </div>
        </div>
      ))}
    </div>
  );
}