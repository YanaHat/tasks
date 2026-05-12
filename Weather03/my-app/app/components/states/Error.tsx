import classes from "./Error.module.css";

export function Error({ message }: { message: string }) {
  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.error}>
          <span className={`material-symbols-outlined ${classes.errorIco}`}>location_off</span>
          
          <h2 className={classes.title}>City not found</h2>
          
          <p className={classes.subtitle}>
            We couldn't find the location you're looking for. 
            Please check the spelling or try searching for a larger city.
          </p>

          <div className={classes.message}>
            <span className="material-symbols-outlined">warning</span>
            <span>{"PLEASE TRY AGAIN"}</span>
          </div>
        </div>

        <div className={classes.grid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={classes.card}>
              <span className="material-symbols-outlined text-primary mb-2"></span>
              <p>--</p>
              <h3>--</h3>
            </div>
          ))}
        </div>

        <div className={classes.map}>
          <button type="submit" className={classes.mapBtn}>
            <span className="material-symbols-outlined">map</span>
            <span className={classes.errorMapMessage}>Map unavailable</span>
          </button>
        </div>
      </div>
    </>
  );
}