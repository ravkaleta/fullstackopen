import axios from 'axios'
import { useState, useEffect } from 'react'

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if(name){
      axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then(response => {
        const data = response.data
        const fetchedCountry = {
          found: true,
          data: {
            name: data.name.common,
            capital: data.capital,
            population: data.population,
            flag: data.flags.png
          }
        }
        setCountry(fetchedCountry)
      })
      .catch(error => {
        setCountry({found: false})
      })
    }

  }, [name])

  return country
}


export default useCountry