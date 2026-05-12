import classes from "./WeatherMap.module.css";

type Props = {
  lat: number;
  lon: number;
};

function WeatherMap({ lat, lon }: Props) {
  const externalMapUrl = `https://www.google.com/maps?q=${lat},${lon}`;

  return (
    <div className={classes.map}>
      <img 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQGAJLuVNdOKKx5FWBnQgRNlaPqrdo99p6HXV6uJS9hJyn91KxTIp4xdJQt7adWWjoikjhbr9PrRKLXFPIb7VUk8juy0BZrKt5qSOFQA3OIK3ejMcA9a_ZWTBWyWfj7Ok1FI_aa7YGxgufRCNd9hEqxm7Ou-7sh0JEjnX-DLgSy_XKjrL61j2IDZ06lnbFViIBp2eo1mwxlVYoMnth_Ln4k-enmZ3zO5kwfLbFkKZMevgjt7MG9NOxa2-fYtWIE1-CNwVwQccLFgE" 
        alt="Map Background"
        className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
      />

      <div className={classes.mapBtn}>
        <div>
          <span className="material-symbols-outlined">location_on</span>
          <a href={externalMapUrl} className="map-btn" target="_blank" rel="noopener noreferrer"> View detailed map</a>
        </div>
      </div>
    </div>
  );
}
export default WeatherMap;