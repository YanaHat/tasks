import classes from './Loading.module.css'

export function Loading() {
  return (
    <>
      <div className={classes.weatherLoad}>
        <div className={classes.inf}>
          <h2 className={classes.nameCountry}> </h2>
          <p className={classes.data}> </p>
          <h1 className={classes.temp}> </h1>
          <p className={classes.description}> </p>
        </div>

        <div className={classes.grid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={classes.card}>
              <span className="material-symbols-outlined text-primary mb-2"></span>
              <p></p>
              <h3></h3>
            </div>
          ))}
        </div>

        <div className={classes.mapContainer}>
          <div className={classes.mapBtn}>
            <div>
              <span className='material-symbols-outlined text-primary'>location_on</span>
              <span className={classes.mapbtn}>Loading map data ...</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}