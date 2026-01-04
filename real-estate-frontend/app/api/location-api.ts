import axios from "axios"

axios.defaults.baseURL = "https://countriesnow.space/api/v0.1/countries"

interface StatesResponse {
  data: {
    data: {
      states: Array<{
        name: string
      }>
    }
  }
}

interface CitiesResponse {
  data: {
    data: string[]
  }
}

const getCountries = async () => {
  const url = "/positions"
  return await axios.get(url)
}

const getStates = async (country: string): Promise<StatesResponse> => {
  const url = `/states/q?country=${country}`
  return await axios.get(url)
}

const getCities = async (country: string, state: string): Promise<CitiesResponse> => {
  const url = `/state/cities/q?country=${country}&state=${state}`
  return await axios.get(url)
}

export { getCountries, getStates, getCities }
