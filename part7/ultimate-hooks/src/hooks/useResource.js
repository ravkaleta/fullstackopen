import { useEffect, useState } from "react"
import axios from 'axios'

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  const getAll = () => {
    axios.get(baseUrl).then(response => {
      console.log(response)
      setResources(response.data)
    })

  }

  const create = (resource) => {
    axios.post(baseUrl, resource).then(response => {
      console.log(response)
      setResources(resources.concat(response.data))
    })
  }

  const service = {
    getAll,
    create
  }

  return [
    resources, service
  ]
}

export default useResource