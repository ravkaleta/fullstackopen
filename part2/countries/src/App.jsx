import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const Countries = ({countries, countryClick}) => {

  return (
    <table style={{ display: 'flex', justifyContent: 'center', margin: '20px'}}>
      <tbody>
          {countries.map(country => 
            <tr key={country.name.common} >
              <td style={{color: 'white', fontSize: '20px', padding: '10px'}}>{country.name.common}</td>
              <td>
                <button 
                  onClick={() => countryClick(country.name.common)}
                  style={{backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid white', padding: '7px', borderRadius: '5px', fontWeight: 'bold', color: 'white'}}
                >
                  Show details
                </button>
              </td>
            </tr>
          )}
      </tbody>
    </table>
  )
}


const CountryView = ({country}) => {
  const [countryWeather, setCountryWeather] = useState(null);

  const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${country.capital}`;

  useEffect(() => {
    axios.get(apiUrl).then(response => {
      console.log(response.data);
      const countryTemp = response.data.current.temp_c;
      const countryWind = response.data.current.wind_kph * 1000/3600;
      const countryConditionIcon = response.data.current.condition.icon;
  
      setCountryWeather({
        temp: countryTemp,
        wind: countryWind.toFixed(2),
        conditionIcon: countryConditionIcon
      })
      
    })
    .catch(error => {
      setCountryWeather(null);
    })
  }, [])
  


  
  return (
    <div className='country'>
      <h1 style={{color: 'white', fontSize: '32px'}}>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <div style={{backgroundColor: 'rgba(255,255,255,0.1)', width: 'auto'}}>
        <p>Languages</p>
        <ul>
          {Object.entries(country.languages).map(([key, language]) => 
            <li key={key}>{language}</li>
          )}
        </ul>
      </div>  
      <img src={country.flags.png} alt='Country flag' />
      {countryWeather ?
          <div>
            <h2>Weather in {country.capital}</h2>
            <p>Temperature: {countryWeather.temp} Celcius</p>
            <img src={countryWeather.conditionIcon} alt='Country condition icon'/>
            <p>Wind: {countryWeather.wind} m/s</p>
          </div>
        :
          <p>Couldn't fetch weather data for capital of this country</p>
      }
      
    </div>
  )
}



const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allCountries, setAllCountries] = useState([]);
  const [countries, setCountries] = useState([]);


  useEffect(() => {
    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setAllCountries(response.data);
        console.log(response.data);
      })
  }, [])

  const onSearchTermChange = (event) => {

    const searchTerm = event.target.value;

    if(searchTerm){
      const filteredCountries = allCountries.filter(country => country.name.common.toLowerCase().includes(searchTerm))
      setCountries(filteredCountries);
    } else {
      setCountries([]);
    }

    setSearchTerm(event.target.value);
  }

  const onCountryClick = (name) => {
    const country = countries.find(country => country.name.common === name); 
    setCountries([country])
  }

  return (
    <div>
      <div className='header'>Find Countries</div>
      <input className='searchBar' value={searchTerm} onChange={onSearchTermChange} placeholder='Search for the country...'/>
      {countries.length <= 10 ?
        countries.length === 1 ?
          <CountryView country={countries[0]}/>
        :
          <Countries countries={countries} countryClick={onCountryClick}/>
      :
        <p>Too many matches, specify another filter</p>
      }
      
      
    </div>
  )
}

export default App
