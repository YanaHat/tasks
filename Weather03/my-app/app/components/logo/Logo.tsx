import classes from './Logo.module.css';
export function Logo() {
  return (
    <div className={classes.logo}>
      <span className="material-symbols-outlined">cloud</span>
      <div>
        <h1 className={classes.title}>SkyGlass<span className={classes.subtitle}>Forecast</span></h1>
      </div>
    </div>
  );
}